'use strict';

const tableName = 'dbinfo';
const sqlBuilder = require('../services/sqlBuilder.js');

module.exports = function(connection) {
  function query(request) {
    return new Promise((resolve, reject) => {
      connection.query(request, (err, response) => {
        err ? reject(err) : resolve(response);
      });
    });
  }

  const settings = {
    create: (cb) => {
      let request1 = [
        'CREATE TABLE ',
        'dbinfo ',
        '(',
        'name varchar(255) NOT NULL UNIQUE, ',
        'value varchar(255) NOT NULL',
        ')'
      ].join('');

      let request2 = [
        'INSERT IGNORE INTO dbinfo ',
        '(name, value) ',
        'VALUES ("version", "0")'
      ].join('');

      return connection.query(request1, function() {
        connection.query(request2, cb);
      });
    },
    get: (cb) => {
      return connection('SELECT * FROM dbinfo', cb);
    },
    getByName: (searchName, cb) => {
      let request = [
        'SELECT value FROM dbinfo ',
        'WHERE name = '
      ].join('') + '"' + searchName + '"';

      return connection.query(request, cb);
    },
    update: (setting, cb) => {
      let request =
        'UPDATE dbinfo' +
        ' SET' +
        ' value = "' + setting.value + '"' +
        ' WHERE name = "' + setting.name + '"';
      return connection.query(request, cb);
    },
    getUiSettings() {
      const request = sqlBuilder.select()
      .from(tableName)
      .field('name')
      .field('value')
      .where('name IN ("timeToBeOnline")')
      .toString();

      return query(request);
    }
  };

  return settings;
};
