'use strict';

const passwordHash = require('password-hash');
const Mailer = require('../services/mailer.js');
const config = require('../config.js');
const utils = require('../utils.js');

module.exports = function (DAL) {
  return {
    verifyPassword: (user, passwordForVerify) => {
      if (!!user.password && passwordHash.verify(user.password, passwordForVerify)) {
        return true;
      } else {
        return false;
      }
    },

    resetPassword: (email, dataError, serverError) => {
      return new Promise((resolve, reject) => {
        let resetToken = utils.newToken();
        DAL.users.addResetToken(resetToken, email).then((response) => {
          if (response.affectedRows) {
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
                resolve({"status": "success"});
              }, (err) => {
                reject(err);
              }
            );
          } else {
            reject(dataError);
          }
        }, (err) => {
          reject(serverError);
        });
      });
    },

    inviteUser: (email, serverError) => {
      return new Promise((resolve, reject) => {
        let resetToken = utils.newToken();
        DAL.users.addUserInvite(email).then(function() {
          DAL.users.addResetToken(resetToken, email);
        })
        .then((response) => {
          const message = [
            'Enter password for your login: ' + 'http://localhost:9000/#!/new-password/' + resetToken,
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
              resolve({"status": "success"});
            }, (err) => {
              reject(err);
            }
          );
        }, (err) => {
          reject(serverError);
        });
      });
    }
  };
}