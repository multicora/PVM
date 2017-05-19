'use strict';

module.exports = function(connection) {
  const settings = {
    create: (cb) => {
      let request1 = [
        'CREATE TABLE',
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
    }
  };

  return settings;
};
