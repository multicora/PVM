'use strict';
const Mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (DAL) {
  return {
    checkAsViewed: (id, token) => {
      if (!token) {
        DAL.conversations.checkAsViewed(id).then((res) => {
          DAL.conversations.selectUserEmailById(id).then((res) => {

            const message = [
              'Your conversation was viwed!'
            ].join('\n');

            const mail = {
              from: ' <bizkonect.project@gmail.com>', // sender address
              to: res.email, // list of receivers
              subject: 'Notification from conversation', // Subject line
              text: message, // plaintext body
              html: '<div style="white-space: pre;">' + message + '</div>'
            };

            Mailer(config.mail).send(mail).then(
              (res) => {
                reply(res);
              }, (err) => {
                reply( Boom.badImplementation(err.message, err) );
              }
            );
          });
        }, (err) => {
          reply( Boom.badImplementation(err.message, err) );
        });
      }
    }
  };
}