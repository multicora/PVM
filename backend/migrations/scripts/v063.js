'use strict';

const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 63,
    message: 'Add "read" to "chat_status" table',
    script: function (next) {
      const request = [
        'ALTER TABLE `chat_status` ',
        'ADD `read` BOOLEAN DEFAULT FALSE;'
      ].join('');

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
