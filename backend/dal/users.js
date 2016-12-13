'use strict';

const Promise = require('promise');
const passwordHash = require('password-hash');

module.exports = (connection) => {
  return {
    getUserById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `users` WHERE id = ' + id
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getUserForLogin: (login, cb) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `users` WHERE email = ' + login
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0], cb);
        });
      });
    },

    addUser: (firstName, secondName, email, password, cb) => {
        return new Promise((resolve, reject) => {
          password = passwordHash.generate(password);
          let request = [
            'INSERT INTO ',
            '`users` (`id`, `firstName`, `secondName`, `email`, `password`) ',
            'VALUES (NULL, "' + firstName + '","' + secondName + '", "' + email + '", "' + password + '");'
          ].join('');

          connection.query(request, (err, cb) => {
            err ? reject(err) : resolve(cb);
          });
        });
    },

    updateToken: (token, email, cb) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE users ',
          'SET token="' + token + "' ",
          'WHERE email=' + email
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    }

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

  }
}
