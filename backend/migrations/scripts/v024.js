'use strict';

const sqlBuilder = require('../../services/sqlBuilder.js');
const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 24,
    message: 'Add author to all videos',
    script: function (next) {

      const request = sqlBuilder.update()
      .table('videos')
      .set(
        'author',
        sqlBuilder.select().field('id').from('users')
      )
      .limit(1)
      .toString();

      connectDB().then(function (connection) {
        connection.query(request, (err) => {
          next(err);
        });
      });

    }
  };
};
