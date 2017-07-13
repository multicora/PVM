'use strict';

const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 60,
    message: 'Add "conversationId" to "notifications" table',
    script: function (next) {
      const request = [
        'ALTER TABLE `notifications` ',
        'ADD `conversationId` int(255);'
      ].join('');

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
