'use strict';

const Promise = require('promise');
const sqlBuilder = require('../../services/sqlBuilder.js');
const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 43,
    message: 'Confirmed exists users',
    script: function (next) {
      connectDB().then(function (connection) {
        function getAll() {
          return new Promise((resolve, reject) => {
            const request = sqlBuilder.select()
              .from('users')
              .field('id')
              .field('firstName')
              .field('secondName')
              .field('email')
              .field('blocked')
              .field('phone')
              .field('company')
              .field('companyPosition')
              .field('photo')
              .field('confirmed')
              .toString();

            connection.query(request, (err, response) => {
              err ? reject(err) : resolve(response);
            });
          });
        }

        function confirmEmail(id) {
          return new Promise((resolve, reject) => {
            let request = [
              'UPDATE `users` ',
              'SET confirmed=TRUE ',
              'WHERE id="' + id + '";'
            ].join('');

            connection.query(request, (err, response) => {
              err ? reject(err) : resolve(response);
            });
          });
        }

        getAll().then((res) => {
          let promises = res.map((user) => {
            return confirmEmail(user.id);
          });
          return Promise.all(promises);
        }).then(() => {
          next();
        });
      });
    }
  };
};
