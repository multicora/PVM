'use strict';

const passwordHash = require('password-hash');
const Mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (DAL) {
  return {
    verifyPassword: (user, passwordForVerify) => {
      if (!!user.password && passwordHash.verify(user.password, passwordForVerify)) {
        return true;
      } else {
        return false;
      }
    },

    resetPassword: (resetToken, email) => {
      let result;

      const message = [
        'Link for reset password: ' + 'http://localhost:4200/new-password/' + resetToken,
      ].join('\n');

      const mail = {
        from: '<bizkonect.project@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Reset password', // Subject line
        text: message, // plaintext body
        html: '<div style="white-space: pre;">' + message + '</div>'
      };

      Mailer(config.mail).send(mail).then(
        (res) => {
          result = ({"status": "success"});
        }, (err) => {
          result = err;
        }
      );
      return result;
    }
  };
}