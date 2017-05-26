'use strict';

const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {
    add: function (name, userId, externalName, externalId, size) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.insert()
          .into('files')
          .set('id', null)
          .set('name', name)
          .set('external_file_name', externalName)
          .set('external_file_id', externalId)
          .set('size', size)
          .set('date', sqlBuilder.str('NOW()'))
          .set('author', userId)
          .toString();

        connection.query(request, function (err) {
          err ? reject(err) : resolve();
        });
      });
    },

    addFileToConversation: function (fileId, conversationId) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.insert()
          .into('files_to_conversations')
          .set('id_file', fileId)
          .set('id_conversation', conversationId)
          .toString();

        connection.query(request, function (err) {
          err ? reject(err) : resolve();
        });
      });
    },

    getById: function (id) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('files')
          .where('id = ' + id)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getFilesByConversation: function (id) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('files_to_conversations')
          .where('id_conversation = ' + id)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    deleteFilesFromConversation: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'DELETE ',
          'FROM files_to_conversations ',
          'WHERE id_conversation=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getByAuthor: function (author) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('files')
          .where('author = ' + author)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
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

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'files ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255), ',
          '`external_file_name` VARCHAR(255) ',
          'NOT NULL UNIQUE, ',
          '`external_file_id` VARCHAR(255) ',
          'NOT NULL UNIQUE, ',
          '`author` int(255) ',
          'NOT NULL, ',
          'size int(255), ',
          'date datetime, ',
          'PRIMARY KEY (id), ',
          'FOREIGN KEY (author) REFERENCES users(id)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableFilesToConversations: (cb) => {
      let request = [
        'CREATE TABLE ',
        'files_to_conversations ',
        '(',
          'id_file int(255), ',
          'id_conversation int(255), ',
          'FOREIGN KEY (id_file) REFERENCES files(id), ',
          'FOREIGN KEY (id_conversation) REFERENCES conversations(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
