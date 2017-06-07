'use strict';

module.exports = function(connection) {
  return {

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'notifications ',
        '(',
          'message varchar(255), ',
          'user int(255), ',
          'date datetime, ',
          'FOREIGN KEY (user) REFERENCES users(id) ',
        ') '
      ].join('');

      return connection.query(request, cb);
    }
  };
};
