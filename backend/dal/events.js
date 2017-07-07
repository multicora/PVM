'use strict';
const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {
    types: () => {
      return {
        'CONVERSATION_IS_VIEWED': 'CONVERSATION_IS_VIEWED',
        'VIDEO_IS_WATCHED': 'VIDEO_IS_WATCHED',
        'FILE_IS_DOWNLOADED': 'FILE_IS_DOWNLOADED'
      };
    },

    get: (type, userId, conversationId) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.select()
          .from('events')
          .field('metadata')
          .where('type = "' + type + '" AND userId = ' + userId + ' AND conversationId = ' + conversationId)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    add: (type, userId, conversationId, data) => {
      let metadata = JSON.stringify(data);
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('events')
          .set('type', type)
          .set('conversationId', conversationId)
          .set('userId', userId)
          .set('metadata', metadata)
          .set('date', sqlBuilder.str('NOW()'))
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'events ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'type varchar(255) NOT NULL, ',
          'conversationId int(255), ',
          'userId int(255), ',
          'metadata varchar(255) NOT NULL, ',
          'date datetime, ',
          'FOREIGN KEY (userId) REFERENCES users(id), ',
          'FOREIGN KEY (conversationId) REFERENCES conversations(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
