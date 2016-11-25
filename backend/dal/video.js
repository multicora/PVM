'use strict';

const Promise = require('promise');

module.exports = function(connection) {
  return {
    addVideo: function (name, externalName) {
      return new Promise(function (resolve, reject) {
        let request = [
          'INSERT INTO ',
            '`videos` (`v_id`, `name`, `url`, `external_file_name`) ',
            'VALUES (NULL, "' + name + '", NULL, "' + externalName + '");'
        ].join('');

        connection.query(request, function (err) {
          err ? reject() : resolve();
        });
      });
    },

    // For migrations
    createTable: function(cb) {
      let request = [
        'CREATE TABLE ',
        'IF NOT EXISTS ',
        'videos ',
        '(',
          'v_id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'name varchar(255), ',
          'url varchar(255), ',
          'PRIMARY KEY (v_id)',
        ') '
      ].join('');

      return connection.query(request, cb);
    },
    addColumn_externalFileName: function (cb) {
      const request = [
        'ALTER TABLE `videos` ',
        'ADD `external_file_name` VARCHAR(255) ',
        'NOT NULL, ',
        'ADD UNIQUE `external_name` (`external_file_name`);'
      ].join('');

      return connection.query(request, cb);
    }
  }
}
