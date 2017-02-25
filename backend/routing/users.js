'use strict';

const Boom = require('boom');
const utils = require('../utils.js');

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
            DAL.users.updateToken(token, user.login).then(() => {
              user.token = token;
              reply(user);
            }, () => {
              reply(Boom.badImplementation('Server error'));
            });
          } else {
            reply(Boom.unauthorized('The username or password is incorrect'));
          }
        }, () => {
          reply(Boom.unauthorized('The username or password is incorrect'));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/reset-password',
    config: {
      handler: function (request, reply) {
        reply(usersController.resetPassword(request.payload.email, Boom.badData('Invalid email'), Boom.badImplementation('Server error')));
      }
    }
  });

  /**
   * @api {post} /api/register Request for register user
   * @apiName RegisterUser
   * @apiGroup Users
   *
   * @apiSuccess {String} status           Status object.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/register',
    config: {
      handler: function (request, reply) {
        if (request.payload.confirmPassword === request.payload.password) {
          DAL.users.register(request.payload.email, request.payload.password).then(
            () => {
              reply({status: 'success'});
            }, (err) => {
              reply( Boom.badImplementation(err.message, err) );
            }
          );
        } else {
          reply(Boom.badData('Passwords do not match'));
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/invite-user',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:invite']
        }
      },
      handler: function (request, reply) {
        reply(usersController.inviteUser(request.payload.email));
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/new-password',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let resetToken = request.payload.resetToken;
        let newPassword = request.payload.newPassword;
        let confirmPassword = request.payload.confirmPassword;
        if (newPassword === confirmPassword) {
          DAL.users.newPassword(resetToken, newPassword).then(
            () => {
              reply({status: 'success'});
            }, (err) => {
              reply( Boom.badImplementation(err.message, err) );
            });
        } else {
          reply(Boom.badData('Passwords do not match'));
        }
      }
    }
  });

  /**
   * @api {get} /api/users Request Users list
   * @apiName GetUsers
   * @apiGroup Users
   *
   * @apiSuccess {Object[]} users           List of user profiles.
   * @apiSuccess {String}   profiles.name   User name.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     [{
   *       "name": "John"
   *     }]
   */
  server.route({
    method: 'GET',
    path: '/api/users',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:read']
        }
      },
      handler: function (request, reply) {
        DAL.users.getAllUsers().then(function(res) {
          reply(res);
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/user/{id}',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:edit']
        }
      },
      handler: function (request, reply) {
        DAL.users.getUserForEdit(request.params.id).then(function(res) {
          reply(res);
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/update-user',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:edit']
        }
      },
      handler: function (request, reply) {
        DAL.users.updateUser(request.payload).then(function(res) {
          reply(res);
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/block-user',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:edit']
        }
      },
      handler: function (request, reply) {
        DAL.users.blockUser(request.payload).then(function(res) {
          reply(res);
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/unblock-user',
    config: {
      auth: 'simple',
      plugins: {
        hapiRouteAcl: {
          permissions: ['users:edit']
        }
      },
      handler: function (request, reply) {
        DAL.users.unblockUser(request.payload).then(function(res) {
          reply(res);
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });
};
