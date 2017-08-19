'use strict';

const connectDB = require('../../dataConnection.js');
const sqlBuilder = require('../../services/sqlBuilder.js');

module.exports = function() {
  return {
    version: 67,
    message: 'Add "timeToBeOnline" to the "settings"',
    script: function (next) {
      const request = sqlBuilder.insert()
      .into('dbinfo')
      .set('name', 'timeToBeOnline')
      .set('value', '10')
      .toString();

      connectDB().then( connection => {
        connection.query(request, err => {
          next(err);
        });
      });
    }
  };
};
