'use strict';

const passwordHash = require('password-hash');
const config = require('../config.js');
const Boom = require('boom');
const utils = require('../utils.js');
const Mailer = require('../services/mailer.js');

module.exports = function (DAL) {
  return {
    verifyPassword: (user, passwordForVerify) => {
      if (!!user.password && passwordHash.verify(user.password, passwordForVerify)) {
        return true;
      } else {
        return false;
      }
    },
    resetPassword: (email) => {
      let resetToken = utils.newToken();
      DAL.users.addResetToken(resetToken, email).then((response) => {

        const message = [
          'Link for reset password: ' + 'http://localhost:4200/new-password/' + resetToken,
        ].join('\n');

        const mail = {
          from: '<bizkonect.project@gmail.com>', // sender address
          to: '<bizkonect.project@gmail.com>', // for testing
          // to: email, // list of receivers
          subject: 'Reset password', // Subject line
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
      }, (err) => {
        reply( Boom.badImplementation(err.message, err) );
      });
    }
  };
}