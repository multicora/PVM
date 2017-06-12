'use strict';
const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  return {

    add: (message, user, metadata) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('notifications')
          .set('message', message)
          .set('user', user)
          .set('metadata', metadata)
          .set('date', sqlBuilder.str('NOW()'))
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    markAsReaded: (id) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('notifications')
          .set('isReaded', true)
          .where('id = ' + id)
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
    },


    addColumnMetadata: function (cb) {
      const request = [
        'ALTER TABLE `notifications` ',
        'ADD `metadata` varchar(255) ',
        'DEFAULT null;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnIsReaded: (cb) => {
      const request = [
        'ALTER TABLE `notifications` ',
        'ADD `isReaded` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },
  };
};
