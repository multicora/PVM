'use strict';
const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {

    getByUser: function (user) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('notifications')
          .where('user = ' + user)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'notifications ',
        '(',
          'message varchar(255), ',
          'user int(255), ',
          'date datetime, ',
          'FOREIGN KEY (user) REFERENCES users(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
