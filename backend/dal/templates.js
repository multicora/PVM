'use strict';

const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = (connection) => {
  return {

    getByAuthor: (author) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT title, message, id ',
          'FROM `conversations` ',
          'WHERE author=' + author + ' AND ',
          'is_template = 1;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM conversations ',
          'WHERE id=' + id + ' AND ',
          'is_template = 1;'
        ].join('');

        connection.query(request, (err, response) => {
          let error;

          if (err) {
            error = err;
          } else if (!response[0]) {
            error = new Error(404);
          }

          error ? reject(error) : resolve(response[0]);
        });
      });
    },

    create: (data) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('conversations')
          .set('id', null)
          .set('videoId', data.videoId)
          .set('logo', data.logo)
          .set('author', data.author)
          .set('title', data.title)
          .set('company_role', data.companyRole)
          .set('name', data.name)
          .set('message', data.message)
          .set('updated', sqlBuilder.str('NOW()'))
          .set('is_template', 1)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    delete: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'DELETE ',
          'FROM conversations ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    update: (data) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('conversations')
          .set('videoId', data.videoId)
          .set('logo', data.logo)
          .set('title', data.title)
          .set('company_role', data.companyRole)
          .set('name', data.name)
          .set('message', data.message)
          .set('updated', sqlBuilder.str('NOW()'))
          .where('id = ' + data.id)
          .toString();

        connection.query(request, (err, response) => {
          let error;

          if (err) {
            error = err;
          } else if (response.affectedRows === 0) {
            error = new Error(404);
          }

          error ? reject(error) : resolve(response);
        });
      });
    },

  };
};
