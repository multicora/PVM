'use strict';

const Promise = require('promise');

module.exports = (connection) => {
  return {
    getById: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM conversations ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getByAuthor: (author) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT title, message, id, email, viewed ',
          'FROM `conversations` ',
          'WHERE author=' + author + ' AND ',
          'is_template = 0;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // TODO: rename to 'create'
    createConversation: (data) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`conversations` (`id`, `videoId`, `email`, `logo`, `author`, `name`,',
            ' `title`, `company_role`, `message`, `is_template`) ',
            'VALUES (NULL, "' + data.videoId + '" ,"' + data.email + '" ,"'
            + data.logo + '" ,"' + data.author + '" ,"' + data.name + '" ,"'
            + data.title + '" ,"' + data.company_role + '" ,"' + data.message
            + '" ,"' + 0 + '");'
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
          'SET =videoId"' + data.videoId + '", ',
          'logo="' + data.logo + '", ',
          'title="' + data.title + '", ',
          'company_role="' + data.companyRole + '", ',
          'message="' + data.message + '" ',
          'WHERE id="' + data.id + '";'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    selectVideoById: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'SELECT videoId ',
            'FROM conversations ',
            'WHERE id=' + id + ';'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    selectUserEmailById: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'SELECT email ',
            'FROM conversations ',
            'WHERE id=' + id + ';'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0]);
          });
        });
    },

    isViewed: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'SELECT viewed ',
            'FROM conversations ',
            'WHERE id=' + id + ';'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response[0].viewed);
          });
        });
    },

    markAsViewed: (id) => {
        return new Promise((resolve, reject) => {
          let request = [
            'UPDATE `conversations` ',
            'SET viewed=TRUE ',
            'WHERE id=' + id + ';'
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
        'conversations ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'videoId int(255), ',
          'email varchar(255), ',
          'author int(255), ',
          'PRIMARY KEY (id), ',
          'FOREIGN KEY (author) REFERENCES users(id), ',
          'FOREIGN KEY (videoId) REFERENCES videos(v_id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    addColumnViewed: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `viewed` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnTitle: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `title` varchar(255);'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnMessage: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `message` varchar(8000);'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnName: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `name` varchar(255);'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnCompanyRole: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `company_role` varchar(255);'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnLogo: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `logo` MEDIUMBLOB;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnIsTemplate: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `is_template` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    }

  };
};
