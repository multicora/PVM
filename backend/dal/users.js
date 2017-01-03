'use strict';

const Promise = require('promise');
const passwordHash = require('password-hash');

module.exports = (connection) => {
  return {
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
            'VALUES (NULL, "' + firstName + '","' + secondName + '", "' + email + '", "' + password + '");'
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
          err  ? reject(err) : resolve(response);
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

    addColumn_resetToken: function (cb) {
      const request = [
        'ALTER TABLE `users` ',
        'ADD `resetToken` VARCHAR(255);'
      ].join('');

      return connection.query(request, cb);
    }

  }
}
