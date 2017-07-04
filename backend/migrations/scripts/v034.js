'use strict';

const sqlBuilder = require('../../services/sqlBuilder.js');
const connectDB = require('../../dataConnection.js');

module.exports = function() {
  return {
    version: 34,
    message: 'Add company to all users',
    script: function (next) {
      const usersId = [];

      connectDB().then(function (connection) {
        return new Promise((resolve, reject) => {
          const request = sqlBuilder.select()
            .from('users')
            .toString();

          connection.query(request, (err, response) => {
            err ? reject(err) : resolve(response);
          });
        }).then((users) => {
          users.map((user) => {
            if (!user.company || user.company === null) {
              usersId.push(user.id);
            }
          });
          let promises = usersId.map(() => {
            return addCompany();
          });

          return Promise.all(promises);
        }).then(company => {
          const usersArr = [];
          for (let i = 0; i < usersId.length; i++) {
            usersArr.push({'id': usersId[i], 'company': company[i].insertId});
          }

          let usersPromises = usersArr.map(user => {
            return updateUserCompany(user);
          });

          return Promise.all(usersPromises);
        }).then(() => {
          next();
        }).catch((err) => {
          next(err);
        });

        function addCompany() {
          return new Promise((resolve, reject) => {
            const request = sqlBuilder.insert()
              .into('company')
              .set('name', null);

            connection.query(request.toString(), (err, response) => {
              err ? reject(err) : resolve(response);
            });
          });
        }

        function updateUserCompany (user) {
          return new Promise((resolve, reject) => {
            let request = [
              'UPDATE users ',
              'SET company="' + user.company + '" ',
              'WHERE id="' + user.id + '";'
            ].join('');

            connection.query(request, (err, response) => {
              err ? reject(err) : resolve(response);
            });
          });
        }
      });
    }
  };
};
