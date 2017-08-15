'use strict';

const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 66,
    message: 'Add "lastActivity" to "users" table',
    script: function (next) {
      const request = [
        'ALTER TABLE `users` ',
        'ADD `lastActivity` TIMESTAMP DEFAULT NOW();'
      ].join('');

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
