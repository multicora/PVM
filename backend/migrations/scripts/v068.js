'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 68,
    message: 'clear "chat" table',
    script: function (next) {
      const request = sqlBuilder.delete()
      .from('chat')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
