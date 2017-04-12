'use strict';

module.exports = (connection) => {
  return {

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
          'message BLOB(255), ',
          'PRIMARY KEY (id), ',
          'FOREIGN KEY (authorId) REFERENCES users(id), ',
          'FOREIGN KEY (conversationId) REFERENCES conversations(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
