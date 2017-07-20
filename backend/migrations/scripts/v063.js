'use strict';
const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 63,
    message: 'Add `thumbnail` to video table',
    script: function (next) {
      connectDB().then(function (connection) {
        let request = [
          'ALTER TABLE `videos` ',
          'ADD `thumbnail` MEDIUMBLOB;'
        ].join('');

        connection.query(request, next);
      });
    }
  };
};
