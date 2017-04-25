'use strict';

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

    // For migrations
    createTable: (cb) => {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
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
        'IF NOT EXISTS ',
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
          'FOREIGN KEY (conversationId) REFERENCES conversations(id), ',
          'FOREIGN KEY (messageId) REFERENCES chat(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
