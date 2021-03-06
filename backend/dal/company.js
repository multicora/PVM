'use strict';

const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = (connection) => {
  return {
    getById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `company` WHERE id = "' + id + '"'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0] || null);
        });
      });
    },

    getByName: (company) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * FROM `company` WHERE name = "' + company.name + '"'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0] || null);
        });
      });
    },

    add: () => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('company')
          .set('name', null);

        connection.query(request.toString(), (err, response) => {
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
