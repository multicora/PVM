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
        let serverUrl = utils.getServerUrl(request);

        usersController.resetPassword(
          request.payload.email,
          serverUrl,
          Boom.badData('Invalid email'),
          Boom.badImplementation('Server error')
        ).then(() => {
          reply();
        }, (err) => {
          reply(Boom.badImplementation('Error while resetting password', err));
        });
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
        usersController.inviteUser(request.payload.email).then(
          (res) => {
            reply(res);
          },
          (err) => {
            reply( Boom.badImplementation(err, err) );
          }
        );
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/new-password',
    config: {
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

  /**
   * @api {get} /api/currentUser Request curresnt User
   * @apiName GetCurrentUser
   * @apiGroup Users
   *
   * @apiSuccess {String}       id   Current User id.
   * @apiSuccess {String}       firstName   Current User first name.
   * @apiSuccess {String}       secondName   Current User second name.
   * @apiSuccess {String}       email   Current User email.
   * @apiSuccess {String}       token   Current User token.
   * @apiSuccess {String}       resetToken   Current User reset token.
   * @apiSuccess {Boolean}      blocked   Current User blocked.
   * @apiSuccess {Boolean}      permanent   Current User permanent.
   * @apiSuccess {String}       firstName   Current User first name.
   * @apiSuccess {String}       phone   Current User phone.
   * @apiSuccess {String}       company   Current User company.
   * @apiSuccess {String}       company_position   Current User company position.
   * @apiSuccess {String}       photo   Current User photo.
   * @apiSuccess {String[]}     roles   Current User roles.
   * @apiSuccess {String[]}     actions   Current User actions.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "id": "2",
   *       "firstName": "admin",
   *       "secondName": "admin",
   *       "email": "admin@admin.com",
   *       "token": "5XnJIwNJSnYUNfaR",
   *       "resetToken": "dsfsfsdf5Tjsd",
   *       "blocked": "0",
   *       "permanent": "1",
   *       "phone": "766567565657",
   *       "company": "1",
   *       "company_position": "fgdgdfgdf",
   *       "photo": "<Buffer 64 61 74 61 3a 69 6d 61 67 65 2f 6a 70 65 67 3b 62 61 73 65 36 34 2c 2f 39 6a 2f 34 41 41 51 53 6b 5a 4a 52 67 41 42 41 51 41 41 41 51 41 42 41 41 44 ... >",
   *       "roles": [ "admin" ],
   *       "actions": [ "CAN_SEE_USERS_PAGE", "CAN_EDIT_USERS", "CAN_INVITE_USERS" ]
   *     }
   */
  server.route({
    method: 'GET',
    path: '/api/currentUser',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        reply(request.auth.credentials);
      }
    }
  });
};
