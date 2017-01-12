'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {

    // For migrations
    createTableRoles: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'roles ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableRolesToUser: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'rolesToUser ',
        '(',
          'id_role int(255), ',
          'id_user int(255), ',
          'FOREIGN KEY (id_role) REFERENCES roles(id), ',
          'FOREIGN KEY (id_user) REFERENCES users(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
}