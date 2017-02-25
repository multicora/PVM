'use strict';

const Boom = require('boom');
const Promise = require('Promise');
const mailer = require('../services/mailer.js');
const config = require('../config.js');
const Template = require('../services/mailTemplate.js');

module.exports = function (server, DAL) {
  const videoCtrl = require('../controllers/video.js')(DAL);
  const usersCtrl = require('../controllers/users.js')(DAL);
  const notificationsCtrl = require('../controllers/notifications.js')(DAL);

  server.route({
    method: 'POST',
    path: '/api/conversations',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        console.log(request.payload.data);
        let author = request.auth.credentials;
        let data = request.payload.data.attributes;
        data.author = author.id;

        DAL.conversations.createConversation(request.payload.data.attributes).then(function() {

          const message = [
            // TODO: config.mail.link should get server addres from request
            'Link: ' + config.mail.link + data.video
          ].join('\n');

          const mail = {
            from: '"' + author.firstName + ' ' + author.secondName + '" <bizkonect.project@gmail.com>', // sender address
            to: request.payload.data.attributes.email, // list of receivers
            subject: 'Complaint from ' + author.firstName + ' ' + author.secondName, // Subject line
            text: message, // plaintext body
            // TODO: config.mail.link should get server addres from request
            html: Template.templateForConversation(config.mail.link, data.video)
          };

          mailer(config.mail).send(mail).then(
            (res) => {
              reply(res);
            }, (err) => {
              reply( Boom.badImplementation(err.message, err) );
            }
          );
        }, function(err) {
          reply(Boom.badImplementation(err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/conversations/{id}',
    config: {
      handler: function (request, reply) {
        let conversationId = request.params.id;
        let token = usersCtrl.parseToken(request.headers.authorization);

        // Finding conversation
        DAL.conversations.getById(conversationId).then((conversation) => {
          // Deciding if we need to mark conversation as viewed
          let needToMarkPromise = new Promise((resolve) => {
            let isViwed;

            DAL.conversations.isViewed(conversation.id).then((result) => {
              isViwed = result;

              return usersCtrl.getUserByToken(token.value);
            }).then(
              (user) => {
                if (conversation.author === user.id) {
                  resolve(false);
                } else {
                  resolve(!isViwed);
                }
              },
              () => {
                resolve(!isViwed);
              }
            );
          });

          needToMarkPromise.then((result) => {
            if (result) {
              // Mark as viewed and notify author
              return DAL.conversations.markAsViewed(conversation.id).then(() => {
                return notificationsCtrl.conversationOpened(conversation);
              });
            } else {
              return Promise.resolve();
            }
          }).then(() => {
            return videoCtrl.getFile(conversation.videoId);
          }).then(
            function (buffer) {
              reply({
                data: {
                  type: 'video',
                  id: 7,
                  attributes: {
                    url: buffer.uri.href
                  }
                }
              });
            },
            function (err) {
              console.error(new Error(err));
              reply(Boom.badImplementation(err, err));
            }
          );
        });

      }
    }
  });
};
