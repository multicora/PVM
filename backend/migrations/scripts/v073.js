'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 73,
    message: 'clear "files" table',
    script: function (next) {
      const request = sqlBuilder.delete()
      .from('files')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
