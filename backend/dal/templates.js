'use strict';

const Promise = require('promise');

module.exports = (connection) => {
  return {
    getById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM conversations ',
          'WHERE id=' + id + ' AND ',
          'is_template = 1;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    create: (data) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`conversations` (`id`, `videoId`, `logo`, `author`, `name`,',
            ' `title`, `company_role`, `message`, `is_template`) ',
            'VALUES (NULL, "' + data.videoId + '" ,"' + data.logo + '" ,"' + data.author
            + '" ,"' + data.name + '" ,"' + data.title + '" ,"'
            + data.company_role + '" ,"' + data.message + '" ,"' + 1 + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response);
          });
        });
    },

    update: (data) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE conversations ',
          'SET videoId="' + data.videoId + '", ',
          'logo="' + data.logo + '", ',
          'title="' + data.title + '", ',
          'name="' + data.name + '", ',
          'company_role="' + data.company_role + '", ',
          'message="' + data.message + '" ',
          'WHERE id="' + data.id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

  };
};
