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
   *
   * @apiParam {Object}   newUser                      new user information.
   * @apiParam {String}   newUser.email                new user email.
   * @apiParam {String}   newUser.password             new user password.
   * @apiParam {String}   newUser.confirmPassword      new user confirm password.
   *
   * @apiName RegisterUser
   * @apiGroup Users
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
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
        usersController.register(request.payload.email,
          request.payload.password,
          request.payload.confirmPassword).then(res => {
          reply(res);
        }, err => {
          reply(Boom.serverUnavailable(err, err));
        });
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

  /**
   * @api {post} /api/update-profile-photo Request for update profile photo
   *
   * @apiParam {String} photo       User new photo
   *
   * @apiName UpdateProfilePhoto
   * @apiGroup Profiles
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
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
        DAL.users.updateProfilePhoto(request.auth.credentials.id, request.payload.photo).then(function() {
          reply({'status': 'success'});
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/update-company-logo Request for update company logo
   *
   * @apiParam {String} photo       company new photo
   *
   * @apiName UpdateCompanyLogo
   * @apiGroup Companys
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
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
        DAL.users.updateCompanyLogo(request.payload.company, request.payload.logo).then(function() {
          reply({'status': 'success'});
        }, function(err) {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/profile Request User profile
   * @apiName GetProfile
   * @apiGroup Profiles
   *
   *
   * @apiSuccess {Object}   profile                      Profile user information.
   * @apiSuccess {String}   profile.id                   Profile user id.
   * @apiSuccess {String}   profile.firstName            Profile user firstName.
   * @apiSuccess {String}   profile.secondName           Profile user secondName.
   * @apiSuccess {String}   profile.email                Profile user email.
   * @apiSuccess {String}   profile.company              Profile user company.
   * @apiSuccess {String}   profile.phone                Profile user phone.
   * @apiSuccess {String}   profile.photo                Profile user photo.
   * @apiSuccess {String}   profile.company_position     Profile user company position.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *  {
   *    "id": "2"
   *    "firstName": "user",
   *    "secondName": "user",
   *    "email": "user@user.com",
   *    "company": "2",
   *    "phone": "367284634",
   *    "photo": null,
   *    "company_position": "manager",
   *  }
   */
  server.route({
    method: 'GET',
    path: '/api/profile',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.getUserForEditProfile(request.auth.credentials.id).then(res => {
          if (res.photo && res.photo !== null) {
            res.photo = res.photo.toString();
          }
          reply(res);
        }, err => {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });


  /**
   * @api {post} /api/company Request Company
   * @apiParam {String} id       company id
   * @apiName GetCompany
   * @apiGroup Companys
   *
   *
   * @apiSuccess {Object}   company                   company information.
   * @apiSuccess {String}   company.id                company id.
   * @apiSuccess {String}   company.name              company name.
   * @apiSuccess {String}   company.logo              company logo.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *    {
   *      "id": 2,
   *      "name": "company",
   *      "logo": null
   *    }
   */
  server.route({
    method: 'post',
    path: '/api/company',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.getCompanyById(request.payload).then(res => {
          if (res.logo && res.logo !== null) {
            res.logo = res.logo.toString();
          }
          reply(res);
        }, err => {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/update-profile Update User profile information
   *
   * @apiParam {Object}   profile                      Profile user new information.
   * @apiParam {String}   profile.id                   Profile user new id.
   * @apiParam {String}   profile.firstName            Profile user new firstName.
   * @apiParam {String}   profile.secondName           Profile user new secondName.
   * @apiParam {String}   profile.email                Profile user new email.
   * @apiParam {String}   profile.phone                Profile user new phone.
   * @apiParam {String}   profile.photo                Profile user new photo.
   * @apiParam {String}   profile.company_position     Profile user new company position.
   *
   * @apiName UpdateProfile
   * @apiGroup Profiles
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
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
        DAL.users.updateUserProfile(request.payload)
        .then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(500, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/update-company Update company information
   *
   * @apiParam {Object}   company                   company new information.
   * @apiParam {String}   company.name              company new name.
   * @apiParam {String}   company.logo              company new logo.
   *
   * @apiName UpdateCompany
   * @apiGroup Companys
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *      "status": "success"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/update-company',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.updateCompany(request.payload)
        .then(function() {
          reply({'status': 'success'});
        }, err => {
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
