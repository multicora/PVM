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
            '`conversations` (`id`, `videoId`, `email`, `author`, `logo`,',
            ' `title`, `company_role`, `message`, `is_template`) ',
            'VALUES (NULL, "' + data.video + '" ,"' + data.email + '" ,"' + data.author + '" ,"' +
              data.logo + '" ,"' + data.company_role + '" ,"' + data.message + '" ,"' + true + '");'
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
