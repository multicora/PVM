'use strict';

const Boom = require('boom');
const utils = require('../utils.js');
const Mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (server, DAL) {
const usersController = require('../controllers/users.js')(DAL);

  server.route({
    method: 'POST',
    path: '/api/login',
    config: {
      handler: function (request, reply) {
        const user = request.payload;
        DAL.users.getUserForLogin(user.login).then((response) => {
          if ( response && usersController.verifyPassword(user, response.password) ) {
            let token = utils.newToken();
            DAL.users.updateToken(token, user.login).then((response) => {
              user.token = token;
              reply(user);
            }, (err) => {
              reply(Boom.badImplementation('Server error'));
            });
          } else {
            reply(Boom.unauthorized('The username or password is incorrect'));
          }
        }, (err) => {
          reply(Boom.unauthorized('The username or password is incorrect'));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/reset_password',
    config: {
      handler: function (request, reply) {
        let resetToken = utils.newToken();
        DAL.users.addResetToken(resetToken, email).then((response) => {
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
              reply(res);
            }, (err) => {
              reply( Boom.badImplementation(err.message, err) );
            }
          );
        })
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/new_password',
    config: {
      handler: function (request, reply) {
        if (request.payload.newPassword === request.payload.confirmPassword) {
          DAL.users.resetPassword(resetToken, newPassword).then((response) => {
            reply();
          }, (err) => {
            reply(err);
          });
        } else {
          reply(Boom.badImplementation('Passwords do not match'));
        }
      }
    }
  });
}