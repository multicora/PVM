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
    path: '/reset-password',
    config: {
      handler: function (request, reply) {
        reply (usersController.resetPassword(request.payload.email, Boom.badData('Invalid email'), Boom.badImplementation('Server error')));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/new-password',
    config: {
      handler: function (request, reply) {
        let resetToken = request.payload.resetToken;
        let newPassword = request.payload.newPassword;
        let confirmPassword = request.payload.confirmPassword;
        if (newPassword === confirmPassword) {
          DAL.users.newPassword(resetToken, newPassword).then(
            (res) => {
              reply({"status": "success"});
            }, (err) => {
              reply( Boom.badImplementation(err.message, err) );
            });
        } else {
          reply(Boom.badData('Passwords do not match'));
        }
      }
    }
  });
}