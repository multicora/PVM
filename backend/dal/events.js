'use strict';
const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {
    types: {
      'CONVERSATION_IS_VIEWED': 'CONVERSATION_IS_VIEWED',
      'VIDEO_IS_WATCHED': 'VIDEO_IS_WATCHED',
      'VIDEO_IS_WATCHING': 'VIDEO_IS_WATCHING',
      'FILE_IS_DOWNLOADED': 'FILE_IS_DOWNLOADED',
      'NEW_MESSAGE': 'NEW_MESSAGE'
    },

    get: (type, userId, conversationId) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.select()
          .from('events')
          .field('metadata')
          .where(`type = "${type}" AND userId = ${userId} AND conversationId = ${conversationId}`)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getByConversationId: (conversationId) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.select()
          .from('events')
          .field('conversationId')
          .field('userId')
          .field('date')
          .field('type')
          .field('metadata')
          .where(`conversationId = ${conversationId}`)
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
    }
  };
};
