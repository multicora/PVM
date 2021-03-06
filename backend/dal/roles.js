'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {

    getRoles: () => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `roles`;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getRolesToActions: () => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `roles_to_actions`;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getRoleByName: (name) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `roles` WHERE name = "' + name + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getRoleById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `roles` WHERE id = "' + id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getRolesByUserId: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `roles_to_user` WHERE id_user = "' + id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    addRoleToUser: (userId, roleId) => {
      return new Promise((resolve, reject) => {
        let request = [
            'INSERT INTO ',
            '`roles_to_user` (`id_role`, `id_user`) ',
            'VALUES ("' + roleId + '", "' + userId + '");'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    addRole: (name) => {
      return new Promise((resolve, reject) => {
        let request = [
            'INSERT INTO ',
            '`roles` (`id`, `name`) ',
            'VALUES (NULL, "' + name + '");'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTableRoles: function(cb) {
      let request = [
        'CREATE TABLE ',
        'roles ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableActions: function(cb) {
      let request = [
        'CREATE TABLE ',
        'actions ',
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
        'roles_to_user ',
        '(',
          'id_role int(255), ',
          'id_user int(255), ',
          'FOREIGN KEY (id_role) REFERENCES roles(id), ',
          'FOREIGN KEY (id_user) REFERENCES users(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableRolesToActions: function(cb) {
      let request = [
        'CREATE TABLE ',
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
};
