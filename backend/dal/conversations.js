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
    // For migrations
    createTable: (cb) => {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'conversations ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'videoId varchar(255), ',
          'email varchar(255), ',
          'author varchar(255), ',
          'PRIMARY KEY (id)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

  }
}
