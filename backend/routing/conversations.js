'use strict';

const Boom = require('boom');
const Mailer = require('../services/mailer.js');
const config = require('../config.js');
const Template = require('../services/mailTemplate.js');

module.exports = function (server, DAL) {
  const notifyCtrl = require('../controllers/notification.js')(DAL);

  server.route({
    method: 'POST',
    path: '/conversations',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let author = request.auth.credentials;
        let data = request.payload.data.attributes;
        data.author = author.id;

        DAL.conversations.createConversation(request.payload.data.attributes).then(function(res) {

          const message = [
            'Link: ' + config.mailConfig.link + data.video,
          ].join('\n');

          const mail = {
            from: '"' + author.firstName + ' ' + author.secondName + '" <bizkonect.project@gmail.com>', // sender address
            to: request.payload.data.attributes.email, // list of receivers
            subject: 'Complaint from ' + author.firstName + ' ' +author.secondName, // Subject line
            text: message, // plaintext body
            html: Template(config.mailConfig.link, data.video)
          };

          Mailer(config.mail).send(mail).then(
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
};