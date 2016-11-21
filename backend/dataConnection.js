const mysql = require('mysql');
const config = require('./config.js')

const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.dbName
});

module.exports = function() {
  return new Promise(
    function(resolve, reject) {

      connection.connect(function(err){
        err ? reject(err) : resolve();
      });

      connection.query('SELECT * FROM pvmDB', function(err, result, fields) {
        err ? reject(err) : resolve();
      });

    }
  );

  connection.end();
};