'use strict';

const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 65,
    message: 'Add "deleted" to "videos" table',
    script: function (next) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `deleted` BOOLEAN DEFAULT FALSE;'
      ].join('');

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
