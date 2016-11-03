var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pvmDB'
});
connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... ");    
  } else {
      console.log("Error connecting database ...");    
  }
});

connection.query('SELECT * FROM pvmDB', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();