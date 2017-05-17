'use strict';

const Boom = require('boom');
const utils = require('../utils.js');
const templates = require('../services/templates.js');
const mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (server, DAL) {
const usersController = require('../controllers/users.js')(DAL);

  /**
   * @api {post} /api/login         Request for login
   *
   * @apiParam {Object}   user                     user info.
   * @apiParam {String}   user.login                     user login.
   * @apiParam {String}   user.password                     user password.
   *
   * @apiName Login
   * @apiGroup Users
   *
   *
   * @apiSuccess {String}   token    Token.
   * @apiSuccess {String}   id    Id.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *      "token": "TPpNRBBz5VEeY7dX"
   *      "id": "2"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/login',
    config: {
      handler: function (request, reply) {
        const user = request.payload;

        usersController.login(user).then((res) => {
          reply(res);
        }).catch((err) => {
          if (err.type === 401) {
            reply(Boom.unauthorized(err.key));
          } else {
            reply(Boom.badImplementation(err));
          }
        });
      }
    }
  });

  /**
   * @api {post} /api/confirm-email         Request for confirm user email
   *
   * @apiParam {String}   confirmToken                     Confirm token.
   *
   * @apiName ConfirmUserEmail
   * @apiGroup Users
   *
   *
   * @apiSuccess {String}   token    Token.
   * @apiSuccess {String}   id    Id.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *      "token": "TPpNRBBz5VEeY7dX"
   *      "id": "2"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/confirm-email',
    config: {
      handler: function (request, reply) {
        DAL.users.getUserByConfirmToken(request.payload.confirmToken).then((response) => {
          if (!response.confirmed) {
              let user = response;
              let token = utils.newToken();
              DAL.users.updateToken(token, user.email).then(() => {
                user.token = token;
                return DAL.users.confirmEmail(user.id);
              }).then(() => {
                reply({
                  'token': user.token,
                  'id': user.id
                });
              }, () => {
                reply(Boom.badImplementation('Server error'));
              });

          } else {
            reply(Boom.unauthorized('You just confirmed your password!'));
          }
        }, () => {
          reply(Boom.unauthorized('The username or password is incorrect'));
        });
      }
    }
  });

  /**
   * @api {post} /api/resend-confirm-mail         Request for resend confirm user mail
   *
   * @apiParam {String}   email                   email.
   *
   * @apiName ResendConfirmMail
   * @apiGroup Users
   *
   *
   * @apiSuccess {String}   status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/resend-confirm-mail',
    config: {
      handler: function (request, reply) {
        let user;
        DAL.users.getUserByEmail(request.payload.email).then(res => {
          user = res;

          return templates.registration(utils.getServerUrl(request) + '/login/' + res.confirmToken);
        }).then( template => {
            const mail = {
              to: user.email,
              subject: 'Confirm email',
              text: template.text,
              html: template.html
            };

            mailer(config).send(mail).then(
              () => {
                reply({'status': 'success'});
              }, (err) => {
                reply(Boom.badImplementation(err.message, err));
              }
            );
        }, err => {
          reply(Boom.badImplementation(err.message, err));
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
        usersController.isUserExist(request.payload.email).then(res => {
          let confirmToken = utils.newToken();
          let result = null;
          let serverUrl = utils.getServerUrl(request) + '/login/' + confirmToken;
          if (res) {
            result = Promise.reject({
              'statusCode': 400,
              'message': 'This email already in use!'
            });
          } else {
            result = usersController.register(request.payload.email,
              request.payload.password,
              request.payload.confirmPassword,
              confirmToken,
              serverUrl);
          }
          return result;
        }).then(() => {
          reply({'status': 'success'});
        }, err => {
          if (err.statusCode === 400){
            reply(Boom.badRequest(err.message, err));
          } else {
            reply(Boom.badImplementation(err.message, err));
          }
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
        permissions: ['users:edit']
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
    method: 'GET',
    path: '/api/profile-photo/{id}',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.users.getUserById(request.params.id).then(function(res) {
          reply(res.photo);
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
        DAL.company.updateLogo(request.payload.company, request.payload.logo).then(function() {
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
        DAL.company.getById(request.payload).then(res => {
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
        DAL.company.update(request.payload)
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
