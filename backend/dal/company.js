'use strict';

const Promise = require('promise');

module.exports = (connection) => {
  return {
    getById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `company` WHERE id = "' + id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    getByName: (company) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `company` WHERE name = "' + company.name + '"'
        ].join('');

        connection.query(request, (err, response) => {
          (err || !response.length) ? reject(err) : resolve(response[0]);
        });
      });
    },

    add: () => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`company` (`id`, `name`) ',
            'VALUES (NULL, "' + null + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response);
          });
        });
    },

    update: (company) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE company ',
          'SET name="' + company.name + '", ',
          'logo="' + company.logo + '" ',
          'WHERE id="' + company.id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    updateLogo: (company, logo) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE company ',
          'SET logo="' + logo + '" ',
          'WHERE id="' + company + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: (cb) => {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'company ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255), ',
          'logo varchar(8000)',
        ') '
      ].join('');

      return connection.query(request, cb);
    }

  };
};
