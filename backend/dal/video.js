'use strict';

const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {
    add: function (name, userId, externalName, id, thumbnail) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.insert()
          .into('videos')
          .set('v_id', null)
          .set('name', name)
          .set('external_file_name', externalName)
          .set('external_file_id', id)
          .set('author', userId)
          .set('thumbnail', thumbnail)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },
    addThumbnail: function (data) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.update()
          .table('videos')
          .set('thumbnail', data.thumbnail)
          .where('v_id = ' + data.video)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
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
    delete: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'DELETE ',
          'FROM videos ',
          'WHERE v_id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },
    getByAuthor: function (author) {
      return new Promise(function (resolve, reject) {
        let request = 'SELECT * FROM `videos` WHERE author = ' + author + ';';

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },
    getAll: function () {
      return new Promise(function (resolve, reject) {
        let request = 'SELECT * FROM `videos`;';

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    setAuthor: function (videoId, authorId) {
      return new Promise(function (resolve, reject) {
        const request = [
         'UPDATE videos SET author=' + authorId + ' ',
         'WHERE v_id = ' + videoId
        ].join('');

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
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
    addColumnExternalFileName: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `external_file_name` VARCHAR(255) ',
        'NOT NULL, ',
        'ADD UNIQUE `external_name` (`external_file_name`);'
      ].join('');

      return connection.query(request, cb);
    },
    addColumnExternalFileId: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `external_file_id` VARCHAR(255) ',
        'NOT NULL, ',
        'ADD UNIQUE `external_id` (`external_file_id`);'
      ].join('');

      return connection.query(request, cb);
    },
    addColumnAuthor: function (cb) {
      const removeRequest = 'ALTER TABLE videos DROP COLUMN author;';
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `author` varchar(255) ',
        'NOT NULL;'
      ].join('');

      return connection.query(removeRequest, function () {
        connection.query(request, cb);
      });
    },
    changeDataTypeAuthor: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'MODIFY `author` int(255);'
      ].join('');

      return connection.query(request, cb);
    },
    addForeignKeyAuthor: function (cb) {
      const request = [
       'ALTER TABLE `videos` ',
       'ADD FOREIGN KEY (author) REFERENCES users(id);'
      ].join('');

      return connection.query(request, cb);
    }
  };
};
