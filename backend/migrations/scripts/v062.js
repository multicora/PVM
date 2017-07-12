'use strict';
const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 62,
    message: 'Delete columns `viewed`, `videoIsWatched`, `file_is_downloaded` from conversations table',
    script: function (next) {
      connectDB().then(function (connection) {
        let request = [
          'ALTER TABLE `conversations` ',
          'DROP `viewed`, ',
          'DROP `videoIsWatched`, ',
          'DROP `file_is_downloaded`;'
        ].join('');

        connection.query(request, next);
      });
    }
  };
};
