'use strict';
const mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (DAL) {
  return {
    checkAsViewed: (id, token) => {
      if (!token) {
        DAL.conversations.checkForViewed(id).then((res) => {
          if(!res) {
            DAL.conversations.markAsViewed(id).then((res) => {
              // DAL.users.selectUserEmailById(id).then((res) => {   // It should be implemented when registration will be added 
              DAL.conversations.selectUserEmailById(id).then((res) => { // It should be remove when registration will be added

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

                mailer(config.mail).send(mail).then(
                  (res) => {
                  }, (err) => {
                  }
                );
              });
            }, (err) => {
            });
          }
        }, (err) => {
        });
      }
    }
  };
};