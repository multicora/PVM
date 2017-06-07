'use strict';
const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {

    add: (data) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('notifications')
          .set('message', data.message)
          .set('user', data.user)
          .set('date', sqlBuilder.str('NOW()'))
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getByUser: function (user) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('notifications')
          .where('user = ' + user)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'notifications ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
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
