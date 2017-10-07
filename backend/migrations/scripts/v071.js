'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 71,
    message: 'clear "files_to_conversations" and "conversations" table',
    script: function (next) {
      const request = sqlBuilder.delete()
      .from('files_to_conversations')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          if (err) {
            next(err);
          } else {
            const request = sqlBuilder.delete()
            .from('conversations')
            .toString();

            connectDB().then( connection => {
              connection.query(request, err => {
                next(err);
              });
            });
          }
        });
      });

    }
  };
};
