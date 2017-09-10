'use strict';

const mysql = require('mysql');
const config = require('./config.js');
const constants = require('./constants');

const options = Object.assign({}, config.db);

if (process.env.ENVIRONMENT === constants.ENVIRONMENTS.DEVELOPMENT) {
  delete options.socketPath;
}

const connection = mysql.createConnection(options);
const promise = new Promise(
  function(resolve, reject) {

    connection.connect(function(err){
      err ? reject(err) : resolve(connection);
    });
  }
);

module.exports = function() {
  return promise;
};
