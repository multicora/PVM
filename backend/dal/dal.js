'use strict'

module.exports = function(connection){
  let DAL = {};

  DAL.videos = {
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
    }
  }

  // Settings
  DAL.settings = require('./settings.js')(connection);

  return DAL;
};