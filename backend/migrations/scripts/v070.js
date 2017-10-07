'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 70,
    message: 'clear "events" table',
    script: function (next) {
      const request = sqlBuilder.delete()
      .from('events')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
