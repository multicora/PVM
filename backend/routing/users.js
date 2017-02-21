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
    path: '/api/reset-password',
    config: {
      handler: function (request, reply) {
        reply (usersController.resetPassword(request.payload.email, Boom.badData('Invalid email'), Boom.badImplementation('Server error')));
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
        reply (usersController.inviteUser(request.payload.email));
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

  /**
   * @api {get} /api/profile Request User profile
   * @apiName GetProfile
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
    path: '/api/profile',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.getUserById(request.payload).then(res => {
          let user = res;
          return user.company;
        })
        .then(res => {
          return DAL.users.getCompanyById(user.company)
        }).then(res => {
          reply(res, user);
        }, err => {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/update-profile Apdate User Profile Information
   * @apiName UpdateProfile
   * @apiGroup Users
   *
   * @apiSuccess {Object[]} user            User profile information.
   * @apiSuccess {String}   user.firstName   User first name.
   * @apiSuccess {String}   user.secondName   User second name.
   * @apiSuccess {String}   user.phone   User phone.
   * @apiSuccess {String}   user.email   User email.
   * @apiSuccess {String}   user.company   User company id.
   * @apiSuccess {String}   user.company_position   User company position.

   * @apiSuccess {Object[]} company         User company.
   * @apiSuccess {String}   company.name    Company name.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *      "fieldCount":0,
   *      "affectedRows":1,
   *      "insertId":0,
   *      "serverStatus":2,
   *      "warningCount":0,
   *       "message":"(Rows matched: 1  Changed: 1  Warnings: 0)",
   *       "protocol41":true,
   *       "changedRows":1
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/update-profile',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let user = request.payload.user;
        let company = request.payload.company;

        if (company.id) {
          Promise.all([
            DAL.users.updateUser(user),
            DAL.users.updateCompany(company)
          ])
          .then(function(res) {
            reply(res);
          }, function(err) {
            reply(Boom.badImplementation(500, err));
          });
        } else {
          DAL.users.addCompany(company).then(res => {
            return res;
          })
          .then(res => {
            user.company = res;
            return DAL.users.updateUser(user);
          })
          .then(res => {
            reply(res);
          }, err => {
            reply(Boom.badImplementation(500, err));
          });
        }
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