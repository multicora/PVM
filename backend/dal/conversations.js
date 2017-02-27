'use strict';

const Promise = require('promise');

module.exports = (connection) => {
  return {
    getById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM conversations ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    // TODO: rename to 'create'
    createConversation: (data) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`conversations` (`id`, `videoId`, `email`, `author`) ',
            'VALUES (NULL, "' + data.video + '" ,"' + data.email + '" ,"' + data.author + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response);
          });
        });
    },

    selectVideoById: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'SELECT videoId ',
            'FROM conversations ',
            'WHERE id=' + id + ';'
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
            'FROM conversations ',
            'WHERE id=' + id + ';'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    isViewed: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'SELECT viewed ',
            'FROM conversations ',
            'WHERE id=' + id + ';'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0].viewed);
          });
        });
    },

    markAsViewed: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'UPDATE `conversations` ',
            'SET viewed=TRUE ',
            'WHERE id=' + id + ';'
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
        'conversations ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'videoId int(255), ',
          'email varchar(255), ',
          'author int(255), ',
          'PRIMARY KEY (id), ',
          'FOREIGN KEY (author) REFERENCES users(id), ',
          'FOREIGN KEY (videoId) REFERENCES videos(v_id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    addColumnViewed: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `viewed` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    }

  };
};
