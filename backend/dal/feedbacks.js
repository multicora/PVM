'use strict';

module.exports = (connection) => {
  return {
    add: (data) => {
        return new Promise((resolve, reject) => {
          let request = [
            'INSERT INTO ',
            '`feedbacks` (`id`, `email`, `message`, `date`) ',
            'VALUES (NULL, "' + data.email + '", "' + data.message + '", NOW());'
          ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    getAll: () => {
      return new Promise((resolve, reject) => {
        let request = [
          'SELECT * ',
          'FROM feedbacks ;'
        ].join('');

        connection.query(request, (err, response) => {
          err ? reject(err) : resolve(response);
        });
      });
    },

    delete: (id) => {
      return new Promise((resolve, reject) => {
        let request = [
          'DELETE ',
          'FROM feedbacks ',
          'WHERE id=' + id + ';'
        ].join('');

        connection.query(request, (err, response) => {
          console.log(response, err);
          err ? reject(err) : resolve(response[0]);
        });
      });
    },

    // For migrations
    createTable: (cb) => {
      let request = [
        'CREATE TABLE ',
        'feedbacks ',
        '(',
          'id int(255) NOT NULL AUTO_INCREMENT UNIQUE, ',
          'email varchar(255), ',
          'message varchar(300), ',
          'answered BOOLEAN DEFAULT FALSE, ',
          'date datetime ',
        ');'
      ].join('');


      return connection.query(request, cb);
    }
  };
};
