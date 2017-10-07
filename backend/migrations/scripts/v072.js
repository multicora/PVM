'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 72,
    message: 'clear "videos" table',
    script: function (next) {
      const request = sqlBuilder.delete()
      .from('videos')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
