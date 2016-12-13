'use strict';

const passwordHash = require('password-hash');

module.exports = function (server, DAL) {
const usersController = require('../controllers/users.js')(DAL);

  server.route({
    method: 'POST',
    path: '/api/login',
    config: {
      handler: function (request, reply) {
        const user = request.payload;
        DAL.users.getUserForLogin(user.login).then((response) => {
          usersController.verifyLogin(user.password, response.password);
        });
      }
    }
  });
}