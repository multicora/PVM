'use strict';

const Boom = require('boom');
const Mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (server, DAL) {

  server.route({
    method: 'POST',
    path: '/conversations',
    handler: function (request, reply) {
      DAL.conversations.createConversation(request.payload.data.attributes).then(function(res) {
        reply(res[0]);
      }, function(err) {
        reply(Boom.badImplementation(err));
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/mailer',
    handler: function (request, reply) {
      const message = [
        'Link: ' + request.payload.link,
        // 'Message: ',
        // request.payload.complaintMessage
      ].join('\n');
      const mail = {
        from: '"No-reply" <no.reply.bizkonect.project@gmail.com>', // sender address
        to: 'no.reply.bizkonect.project@gmail.com', // list of receivers
        subject: 'Complaint from ' + request.payload.name, // Subject line
        text: message, // plaintext body
        html: '<div style="white-space: pre;">' + message + '</div>' // html body
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          reply(res);
        }, (err) => {
          reply( Boom.badImplementation(err.message, err) );
        }
      );
    }
  });
};