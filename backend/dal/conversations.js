'use strict';

const Promise = require('promise');
const passwordHash = require('password-hash');

module.exports = (connection) => {
  return {
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

    checkAsViewed: (id) => {
        return new Promise((resolve, reject) => {

          let request = [
            'INSERT INTO ',
            '`conversations` (`viewed`) ',
            'VALUES (TRUE) ',
            'WHERE id=`' + id + '`;'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
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

    addColumn_viewed: function (cb) {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `viewed` BOOLEAN ',
        'NOT NULL ',
        'DEFAULT false '
      ].join('');

      return connection.query(request, cb);
    },

  }
}
