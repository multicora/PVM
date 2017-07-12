'use strict';
const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 61,
    message: 'Add table "events" to db',
    script: function (next) {
      connectDB().then(function (connection) {
        let request = [
          'CREATE TABLE ',
          'events ',
          '(',
            'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
            'type varchar(255) NOT NULL, ',
            'conversationId int(255), ',
            'userId int(255), ',
            'metadata varchar(255) NOT NULL, ',
            'date datetime, ',
            'FOREIGN KEY (userId) REFERENCES users(id), ',
            'FOREIGN KEY (conversationId) REFERENCES conversations(id) ',
          ') '
        ].join('');

        connection.query(request, next);
      });
    }
  };
};
