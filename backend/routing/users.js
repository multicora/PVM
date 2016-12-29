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
    path: '/reset-passwords',
    config: {
      handler: function (request, reply) {
        let resetToken = utils.newToken();
        DAL.users.addResetToken(resetToken, request.payload.data.attributes.email).then((response) => {
          const message = [
            'Link for reset password: ' + 'http://localhost:4200/new-password/' + resetToken,
          ].join('\n');

          const mail = {
            from: '<bizkonect.project@gmail.com>', // sender address
            to: '<bizkonect.project@gmail.com>', //for test
            // to: mail, // list of receivers 
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
          reply(err);
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/new-passwords',
    config: {
      handler: function (request, reply) {
        let resetToken = request.payload.data.attributes.token;
        let newPassword = request.payload.data.attributes.new;
        let confirmPassword = request.payload.data.attributes.confirm;
        if (newPassword === confirmPassword) {
          DAL.users.newPassword(resetToken, newPassword).then(
            (res) => {
              reply(res);
            }, (err) => {
              reply(err);
            });
        } else {
          reply(Boom.badData('Passwords do not match'));
        }
      }
    }
  });
}