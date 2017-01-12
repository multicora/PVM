'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {

    getActionByName: (name) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `actions` WHERE name = "' + name + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response);
        });
      });
    },

    addAction: (name) => {
      return new Promise((resolve, reject) => {
        let request = [
            'INSERT INTO ',
            '`actions` (`id`, `name`) ',
            'VALUES (NULL, "' + name + '");'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTableActions: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'actions ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableRolesToActions: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'roles_to_actions ',
        '(',
          'id_role int(255), ',
          'id_action int(255), ',
          'FOREIGN KEY (id_role) REFERENCES roles(id), ',
          'FOREIGN KEY (id_action) REFERENCES actions(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
}