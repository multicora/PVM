'use strict';

const Promise = require('promise');
const sqlBuilder = require('../services/sqlBuilder.js');

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

    getAll: () => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM conversations ;'
        ].join('');

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

    getByAuthor: (author) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.select()
          .from('conversations')
          .field('id')
          .field('email')
          .field('viewed')
          .field('videoIsWatched')
          .field('title')
          .field('message')
          .field('updated')
          .where('author = ' + author + ' AND is_template = 0')
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getByEmail: (email) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.select()
          .from('conversations')
          .field('id')
          .field('author')
          .field('viewed')
          .field('title')
          .field('message')
          .field('updated')
          .where('email = "' + email + '" AND is_template = 0')
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    create: (data) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('conversations')
          .set('videoId', data.videoId)
          .set('email', data.email)
          .set('logo', data.logo)
          .set('author', data.author)
          .set('name', data.name)
          .set('title', data.title)
          .set('company_role', data.company_role)
          .set('message', data.message)
          .set('is_template', 0)
          .set('updated', sqlBuilder.str('NOW()'))
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
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
          .set('message', data.message)
          .set('updated', sqlBuilder.str('NOW()'))
          .where('id = ' + data.id)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    updateTime: (id) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('conversations')
          .set('updated', sqlBuilder.str('NOW()'))
          .where('id = ' + id)
          .toString();

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

    markAsViewed: (id) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('conversations')
          .set('viewed', true)
          .set('updated', sqlBuilder.str('NOW()'))
          .where('id = ' + id)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    markAsWatched: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE `conversations` ',
          'SET videoIsWatched=TRUE ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    markAsDownloaded: (id) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('conversations')
          .set('file_is_downloaded', true)
          .where('id = ' + id)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    // For migrations
    createTable: (cb) => {
      let request = [
        'CREATE TABLE ',
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

    addColumnIsWatched: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `is_watched` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },

    renameColumnIsWatched: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'CHANGE `is_watched` `video_is_watched` BOOLEAN ',
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
    },

    addColumnUpdated: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `updated` datetime ',
        'DEFAULT NOW();'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnIsPublic: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `is_public` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },

    addColumnFileIsDownloaded: (cb) => {
      const request = [
        'ALTER TABLE `conversations` ',
        'ADD `file_is_downloaded` BOOLEAN ',
        'DEFAULT FALSE;'
      ].join('');

      return connection.query(request, cb);
    },

    changeVideoIsWatchedFieldName: function (cb) {
      const request = [
        'ALTER TABLE conversations CHANGE video_is_watched videoIsWatched VARCHAR(255);'
      ].join('');

      return connection.query(request, cb);
    }
  };
};
