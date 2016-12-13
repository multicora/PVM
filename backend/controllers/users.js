'use strict';

const Promise = require('promise');
const passwordHash = require('password-hash');
const utils = require('../utils.js');

module.exports = function (DAL) {
  return {
    verifyLogin: (password, passwordForVerify) => {
      console.log(password, passwordForVerify);
      console.log(passwordHash.verify(user.password, passwordForVerify));
      if (!!password && passwordHash.verify(user.password, passwordForVerify)) {
        console.log(11111);
        let token = utils.newToken();
        console.log(token);
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
    }
  }
}