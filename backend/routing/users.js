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
            (res) => {
              reply({"status": "success"});
            }, (err) => {
              reply(Boom.badData('This email already in use!'));
            }
          );
        } else {
          reply(Boom.badData('Passwords do not match!'));
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
   * @api {post} /api/update-profile-photo Request for update profile photo
   * @apiName UpdateProfilePhoto
   * @apiGroup Users

   * @apiSuccess {Object[]} photo           Profile photo information.
   * @apiSuccess {String}   photo.photo     Profile photo.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
      {
        "status": "success"
      }
   */
  server.route({
    method: 'POST',
    path: '/api/update-profile-photo',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.updateProfilePhoto(request.auth.credentials.id, request.payload.photo).then(function(res) {
          reply({"status": "success"});
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/update-company-logo Request for update company logo
   * @apiName UpdateCompanyLogo
   * @apiGroup Users

   * @apiSuccess {Object[]} company         Company logo information.
   * @apiSuccess {String}   company.logo    Company logo.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
      {
        "status": "success"
      }
   */
  server.route({
    method: 'POST',
    path: '/api/update-company-logo',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.updateCompanyLogo(request.payload.company, request.payload.logo).then(function(res) {
          reply({"status": "success"});
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
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
      [{
         "id":2,
         "name":"company",
         "logo":null
       },
       {
         "firstName":"user",
         "secondName":"user",
         "email":"user@user.com",
         "company":2,
         "phone":"367284634",
         "photo": null,
         "company_position":"manager",
         "id":2
       }]
   */
  server.route({
    method: 'GET',
    path: '/api/profile',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let user;
        DAL.users.getUserForEditProfile(request.auth.credentials.id).then(res => {
          user = res;
          if (user.company) {
            return DAL.users.getCompanyById(user.company);
          } else {
            return {};
          }
        }).then(res => {
          reply([res, user]);
        }, err => {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/update-profile Apdate User profile information
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
   *      "status": "success"
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
            DAL.users.updateUserProfile(user),
            DAL.users.updateCompany(company)
          ])
          .then(function(res) {
            reply(res);
          }, function(err) {
            reply(Boom.badImplementation(500, err));
          });
        } else {
          DAL.users.addCompany(company).then(res => {
            return DAL.users.getCompanyByName(company);
          })
          .then(res => {
            user.company = res.id;
            return DAL.users.updateUserProfile(user);
          })
          .then(res => {
            reply({"status": "success"});
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