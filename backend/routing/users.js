'use strict';

const passwordHash = require('password-hash');

module.exports = function (server, DAL) {

  server.route({
    method: 'POST',
    path: '/api/login',
    config: {
      handler: function (request, reply) {
        const user = request.payload;
        DAL.users.getUserForLogin(user.login, (err, response) => {
          if (!!response[0] && passwordHash.verify(user.password, response[0].password)) {
              let token = Utils.newToken();
              DAL.users.updateToken(token, user.login, (err, user) => {
                if (user) {
                  user.token = token;
                  reply(user);
                } else {
                  reply( Boom.badImplementation('Server error') )
                }
              });
          } else {
            reply(Boom.unauthorized('The username or password is incorrect'));
          }
        });
      }
    }
  });
}