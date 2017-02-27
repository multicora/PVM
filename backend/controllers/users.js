'use strict';

const passwordHash = require('password-hash');
const Promise = require('promise');
const mailer = require('../services/mailer.js');
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

    resetPassword: (email, serverUrl, dataError, serverError) => {
      return new Promise((resolve, reject) => {
        let resetToken = utils.newToken();
        DAL.users.addResetToken(resetToken, email).then((response) => {
          if (response.affectedRows) {
            const message = [
              'Link for reset password: ' + serverUrl + '/new-password/' + resetToken
            ].join('\n');

            const mail = {
              to: email,
              subject: 'Reset password',
              text: message
            };

            mailer(config).send(mail).then(
              () => {
                // TODO: need to use 'resolve();' or 'resolve(res);'
                // because '{status: 'success'}' related to request
                resolve({status: 'success'});
              }, (err) => {
                reject(err);
              }
            );
          } else {
            reject(dataError);
          }
        }, () => {
          reject(serverError);
        });
      });
    },

    register: (email, password, confirmPassword) => {
      return new Promise((resolve, reject) => {
        DAL.users.getUserByEmail(email).then(
          () => {
            reject('This email already in use!');
        }, () => {
          let result;
            if (confirmPassword === password) {
              result = DAL.users.addCompanyForRegister();
            } else {
              reject('Passwords do not match!');
            }
            return result;
        }).then((res) => {
          return DAL.users.register(email, password, res.insertId);
        }).then(() => {
          resolve({'status': 'success'});
        }, (err) => {
          reject(err);
        });
      });
    },

    inviteUser: (email) => {
      return new Promise((resolve, reject) => {
        let resetToken = utils.newToken();
        DAL.users.addUserInvite(email).then(function() {
           return DAL.users.addResetToken(resetToken, email);
        }).then(() => {
          const message = [
            // TODO: config.mail.linkForNewPassword should get server addres from request
            'Enter password for your login: ' + config.mail.linkForNewPassword + resetToken
          ].join('\n');

          const mail = {
            to: email,
            subject: 'Invitation',
            text: message
          };

          mailer(config).send(mail).then(
            () => {
              // TODO: need to use 'resolve();' or 'resolve(res);'
              // because '{status: 'success'}' related to request
              resolve({status: 'success'});
            }, (err) => {
              reject(err);
            }
          );
        }, (err) => {
          reject(err);
        });
      });
    },

    getUserByToken: (token) => {
      let actionsArr;
      let rolesArr;
      let user;

      return DAL.users.getUserByToken(token).then((res) => {
        user = res;

        return DAL.roles.getRolesByUserId(user.id);
      }).then((roles) => {
        let rolesPromisies = roles.map(function(role) {
          return DAL.roles.getRoleById(role.id_role);
        });

        return Promise.all(rolesPromisies);
      }).then((roles) => {
        rolesArr = roles.map(function(role) {
          return role.name;
        });

        let getActionsPromisies = roles.map(function(role) {
          return DAL.actions.getActionsByRoleId(role.id);
        });

        return Promise.all(getActionsPromisies);
      }).then((actions) => {
        let actionsId = [];
        if (actions.length > 0) {
          actionsId = actions[0].map(function(action) {
            return action.id_action;
          });
        }

        let actionsPromisies = actionsId.map(function(action) {
          return DAL.actions.getActionById(action);
        });

        return Promise.all(actionsPromisies);
      }).then((actions) => {
        actionsArr = actions.map(function(action) {
          return action.name;
        });
      }).then(() => {
        user.roles = rolesArr;
        user.actions = actionsArr;

        return user;
      });
    },

    parseToken: (token) => {
      token = token || '';

      let splitted = token.split(' ');

      return {
        name: splitted[0] || '',
        value: splitted[1] || ''
      };
    }
  };
};
