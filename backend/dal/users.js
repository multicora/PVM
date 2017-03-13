'use strict';

const Promise = require('promise');
const passwordHash = require('password-hash');

module.exports = (connection) => {
  return {

    register: (email, password, company) => {
        return new Promise((resolve, reject) => {
          password = passwordHash.generate(password);
          let request = [
            'INSERT INTO ',
            '`users` (`id`, `email`, `password`, `company`) ',
            'VALUES (NULL, "' + email + '","' + password + '","' + company + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    getUserById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `users` WHERE id = "' + id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getUserByEmail: (email) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `users` WHERE email = "' + email + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getCompanyById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `company` WHERE id = "' + id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getCompanyByName: (company) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `company` WHERE name = "' + company.name + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getUserForEdit: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT firstName, secondName, email, id ',
          'FROM `users` WHERE id = "' + id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response);
        });
      });
    },

    getUserForEditProfile: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT firstName, secondName, email, company, phone, photo, company_position, id ',
          'FROM `users` WHERE id = "' + id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getAll: function () {
      return new Promise(function (resolve, reject) {
        let request = [
          'SELECT * ',
          'FROM `users`;'
        ].join('');

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getAllUsers: function () {
      return new Promise(function (resolve, reject) {
        let request = [
          'SELECT firstName, secondName, email, blocked, id, permanent, company, company_position, phone ',
          'FROM `users`;'
        ].join('');

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getUserForLogin: (login) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `users` WHERE email = "' + login + '"'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    selectUserEmailById: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'SELECT email ',
            'FROM users ',
            'WHERE id=' + id + ';'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    getUserByToken: (token) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `users` WHERE token = "' + token + '"'
        ].join('');

        connection.query(request, (err, response) => {
          if (err) {
            reject(err);
          } else if (!response.length) {
            reject('Not found');
          } else {
            resolve(response[0]);
          }
        });
      });
    },

    addResetToken: (resetToken, email) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE `users` ',
          'SET resetToken="' + resetToken + '" ',
          'WHERE email="' + email + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    blockUser: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE `users` ',
          'SET blocked=TRUE ',
          'WHERE id="' + id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    unblockUser: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE `users` ',
          'SET blocked=FALSE ',
          'WHERE id="' + id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    newPassword: (resetToken, password) => {
      return new Promise((resolve, reject) => {

        password = passwordHash.generate(password);
        let request = [
          'UPDATE `users` ',
          'SET password="' + password + '", ',
          'resetToken="' + null + '" ',
          'WHERE resetToken="' + resetToken + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    addUser: (firstName, secondName, email, password) => {
        return new Promise((resolve, reject) => {
          password = passwordHash.generate(password);
          let request = [
            'INSERT INTO ',
            '`users` (`id`, `firstName`, `secondName`, `email`, `password`) ',
            'VALUES (NULL, "' + firstName + '","' + secondName + '","' + email + '","' + password + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    addCompanyForRegister: () => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`company` (`id`, `name`) ',
            'VALUES (NULL, "' + null + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response);
          });
        });
    },

    addUserInvite: (email) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`users` (`id`, `email`) ',
            'VALUES (NULL, "' + email + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    updateToken: (token, email) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET token="' + token + '" ',
          'WHERE email="' + email + '"'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    updateUser: (user) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET firstName="' + user.firstName + '", ',
          'secondName="' + user.secondName + '", ',
          'email="' + user.email + '" ',
          'WHERE id="' + user.id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    updateUserProfile: (user) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET firstName="' + user.firstName + '", ',
          'secondName="' + user.secondName + '", ',
          'email="' + user.email + '", ',
          'phone="' + user.phone + '", ',
          'photo="' + user.photo + '", ',
          'company="' + user.company + '", ',
          'company_position="' + user.company_position + '" ',
          'WHERE id="' + user.id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    updateProfilePhoto: (user, photo) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET photo="' + photo + '" ',
          'WHERE id="' + user + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    updateUserCompany: (user) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET company="' + user.company + '" ',
          'WHERE id="' + user.id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    permanentUser: (email) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET permanent=TRUE ',
          'WHERE email="' + email + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: (cb) => {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'users ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'firstName varchar(255), ',
          'secondName varchar(255), ',
          'email varchar(255) UNIQUE, ',
          'password varchar(255), ',
          'token varchar(255), ',
          'PRIMARY KEY (id)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableCompany: (cb) => {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'company ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255), ',
          'logo varchar(8000)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    changeTypeOfColumn: function (table, column, type, cb) {
      const request = [
        'ALTER TABLE `' + table + '` ',
        'MODIFY COLUMN `' + column + '` ' + type + ';'
      ].join('');

      return connection.query(request, cb);
    },

    changeUserPhotoType: function (cb) {
      const request = [
        'ALTER TABLE `users` ',
        'MODIFY COLUMN `photo` BLOB;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnResetToken: function (cb) {
      const request = [
        'ALTER TABLE `users` ',
        'ADD `resetToken` VARCHAR(255);'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnPermanent: function (cb) {
      const request = [
        'ALTER TABLE `users` ',
        'ADD `permanent` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnBlocked: function (cb) {
      const request = [
        'ALTER TABLE `users` ',
        'ADD `blocked` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnsForProfile: function (cb) {
      const request = [
        'ALTER TABLE `users` ',
        'ADD `phone` VARCHAR(255), ',
        'ADD `company` int(255), ',
        'ADD `company_position` VARCHAR(255), ',
        'ADD `photo` VARCHAR(8000), ',
        'ADD FOREIGN KEY (company) REFERENCES company(id);'
      ].join('');

      return connection.query(request, cb);
    }

  };
};
