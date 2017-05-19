'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {
    add: function (name, userId, externalName, id) {
      return new Promise(function (resolve, reject) {
        let request = [
          'INSERT INTO ',
            '`files` (`id`, `name`, `url`, `external_file_name`, `external_file_id`, `author`) ',
            'VALUES (NULL, "' + name + '", NULL, "' + externalName + '", "' + id + '", "' + userId + '");'
        ].join('');

        connection.query(request, function (err) {
          err ? reject(err) : resolve();
        });
      });
    },

    getById: function (id) {
      return new Promise(function (resolve, reject) {
        let request = [
          'SELECT * FROM `files` WHERE id = ' + id
        ].join('');

        connection.query(request, function (err, response) {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    delete: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'DELETE ',
          'FROM files ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getByAuthor: function (author) {
      return new Promise(function (resolve, reject) {
        let request = 'SELECT * FROM `files` WHERE author = ' + author + ';';

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    }

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'files ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255), ',
          'url varchar(255), ',
          'ADD `external_file_name` VARCHAR(255) ',
          'NOT NULL, ',
          'ADD UNIQUE `external_name` (`external_file_name`), '
          'ADD `external_file_id` VARCHAR(255) ',
          'NOT NULL, ',
          'ADD UNIQUE `external_id` (`external_file_id`), ',
          'ADD `author` int(255) ',
          'NOT NULL, ',
          'PRIMARY KEY (id), ',
          'ADD FOREIGN KEY (author) REFERENCES users(id);',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
