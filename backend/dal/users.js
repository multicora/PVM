'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {
    getUserById: function (id) {
      return new Promise(function (resolve, reject) {
        let request = [
          'SELECT * FROM `users` WHERE id = ' + id
        ].join('');

        connection.query(request, function (err, response) {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    addUser: function(firstName, secondName, email, password, cb) {
        return new Promise(function (resolve, reject) {
          let request = [
            'INSERT INTO ',
            '`users` (`id`, `firstName`, `secondName`, `email`, `password`) ',
            'VALUES (NULL, "' + firstName + '","' + secondName + '", "' + email + '", "' + password + '");'
          ].join('');

          connection.query(request, function (err, cb) {
            err ? reject(err) : resolve(cb);
          });
        });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'users ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'firstName varchar(255), ',
          'secondName varchar(255), ',
          'email varchar(255), ',
          'password varchar(255), ',
          'PRIMARY KEY (id)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

  }
}
