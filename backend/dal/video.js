'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {
    add: function (name, userId, externalName, id) {
      return new Promise(function (resolve, reject) {
        let request = [
          'INSERT INTO ',
            '`videos` (`v_id`, `name`, `url`, `external_file_name`, `external_file_id`, `author`) ',
            'VALUES (NULL, "' + name + '", NULL, "' + externalName + '", "' + id + '", "' + userId + '");'
        ].join('');

        connection.query(request, function (err) {
          err ? reject() : resolve();
        });
      });
    },
    get: function (id) {
      return new Promise(function (resolve, reject) {
        let request = [
          'SELECT * FROM `videos` WHERE v_id = ' + id
        ].join('');

        connection.query(request, function (err, response) {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },
    getAllVideos: function () {
      return new Promise(function (resolve, reject) {
        let request = 'SELECT * FROM `videos`;';

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'videos ',
        '(',
          'v_id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255), ',
          'url varchar(255), ',
          'PRIMARY KEY (v_id)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },
    addColumn_externalFileName: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `external_file_name` VARCHAR(255) ',
        'NOT NULL, ',
        'ADD UNIQUE `external_name` (`external_file_name`);'
      ].join('');

      return connection.query(request, cb);
    },
    addColumn_externalFileId: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `external_file_id` VARCHAR(255) ',
        'NOT NULL, ',
        'ADD UNIQUE `external_id` (`external_file_id`);'
      ].join('');

      return connection.query(request, cb);
    },
    addColumn_author: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `author` VARCHAR(255) ',
        'NOT NULL;'
      ].join('');

      return connection.query(request, cb);
    }
  }
}
