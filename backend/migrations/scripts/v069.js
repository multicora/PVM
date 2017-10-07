'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 69,
    message: 'clear "chat_status" table',
    script: function (next) {
      const request = sqlBuilder.delete()
      .from('chat_status')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
