'use strict';

const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 64,
    message: 'Add "uploadDate" to "videos" table',
    script: function (next) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `uploadDate` datetime DEFAULT NOW();'
      ].join('');

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
