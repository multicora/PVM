'use strict';

const Boom = require('boom');
const Promise = require('promise');
const mailer = require('../services/mailer.js');
const config = require('../config.js');
const template = require('../services/mailTemplate.js');
const utils = require('../utils.js');

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
        let author = request.auth.credentials;
        let data = request.payload;
        data.author = author.id;

          DAL.conversations.createConversation(data).then(function(res) {
            try {
              let serverUrl = utils.getServerUrl(request);
              const message = 'Link: ' + serverUrl + '/conversation/' + data.video;
              const from = [
                author.firstName + ' ',
                author.secondName + ' ',
                config.mail.defaultFrom
              ].join('');

              const mail = {
                from: from,
                to: data.email,
                // TODO: Complaint???
                subject: 'Complaint from ' + author.firstName + ' ' + author.secondName, // Subject line
                text: message,
                html: template.templateForConversation(serverUrl + '/conversation/' + res.insertId)
              };
              mailer(config).send(mail).then(
                (res) => {
                  reply(res);
                }, (err) => {
                  reply( Boom.badImplementation(err.message, err) );
                }
              );
            } catch (err) {
              reply(Boom.badImplementation(err, err));
            }
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
              conversation.url = buffer.uri.href;
              reply(conversation);
            },
            function (err) {
              reply(Boom.badImplementation(err, err));
            }
          );
        });

      }
    }
  });
};
