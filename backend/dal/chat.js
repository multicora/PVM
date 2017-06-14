'use strict';
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = (connection) => {
  return {
    add: (data) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`chat` (`id`, `message`, `conversationId`, `authorId`, `date`) ',
            'VALUES (NULL, "' + data.message + '", "' + data.conversationId + '", "' +
              data.authorId + '", NOW());'
          ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getByConversationId: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM chat ',
          'WHERE conversationId=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getAll: () => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM chat ;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getAllStatus: function (conversationId) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('chat_status')
          .where('conversationId = ' + conversationId)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getStatus: function (conversationId, userId) {
      return new Promise(function (resolve, reject) {
        const request = sqlBuilder.select()
          .from('chat_status')
          .where('conversationId = ' + conversationId)
          .where('userId = ' + userId)
          .toString();

        connection.query(request, function (err, response) {
          err ? reject(err) : resolve(response);
        });
      });
    },

    addStatus: (conversationId, userId) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.insert()
          .into('chat_status')
          .set('conversationId', conversationId)
          .set('userId', userId)
          .set('notified', true)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    markAsNotified: (conversationId, userId) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('chat_status')
          .set('notified', true)
          .where('conversationId = ' + conversationId)
          .where('userId = ' + userId)
          .toString();

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    markAsUnNotified: (conversationId, userId) => {
      return new Promise((resolve, reject) => {
        const request = sqlBuilder.update()
          .table('chat_status')
          .set('notified', false)
          .where('conversationId = ' + conversationId)
          .where('userId = ' + userId)
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
          'FROM chat ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          console.log(response, err);
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    deleteStatus: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'DELETE ',
          'FROM chat_status ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          console.log(response, err);
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    getStatusTable: (data) => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM chat_status ',
          'WHERE conversationId=' + data.conversationId + ' AND ',
          'userId=' + data.userId + ';'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    createStatusTable: (data) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`chat_status` (`id`, `userId`, `conversationId`, `messageId`) ',
            'VALUES (NULL, "' + data.userId + '" ,"' + data.conversationId + '" ,"'
            + data.messageId + '");'
          ].join('');

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response);
          });
        });
    },

    updateStatus: (data) => {
      return new Promise((resolve, reject) => {
        let request = [
          'UPDATE chat_status ',
          'SET messageId="' + data.messageId + '" ',
          'WHERE id="' + data.id + '";'
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
        'chat ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'conversationId int(255), ',
          'authorId int(255), ',
          'date datetime, ',
          'message varchar(300), ',
          'PRIMARY KEY (id), ',
          'FOREIGN KEY (authorId) REFERENCES users(id), ',
          'FOREIGN KEY (conversationId) REFERENCES conversations(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    },

    createTableChatStatus: (cb) => {
      let request = [
        'CREATE TABLE ',
        'chat_status ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'conversationId int(255), ',
          'userId int(255), ',
          'messageId int(255), ',
          'notified BOOLEAN ',
          'DEFAULT FALSE, ',
          'PRIMARY KEY (id), ',
          'FOREIGN KEY (userId) REFERENCES users(id), ',
          'FOREIGN KEY (conversationId) REFERENCES conversations(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
