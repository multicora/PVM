'use strict';

const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 47,
    message: 'Moving to backblaze',
    script: function (next) {
      connectDB().then(function (connection) {
        truncateTable('chat_status').then(() => {
          return truncateTable('conversations');
        }).then(() => {
          return truncateTable('chat');
        }).then(() => {
          return truncateTable('videos');
        }).then(() => {
          next();
        }).catch((err) => {
          next(err);
        });

        function truncateTable(name) {
          return new Promise((resolve, reject) => {
            let request = `delete from ${name};`;

            connection.query(request, (err, response) => {
              err ? reject(err) : resolve(response[0]);
            });
          });
        }
      });
    }
  };
};
