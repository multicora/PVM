'use strict';

const passwordHash = require('password-hash');

module.exports = function (DAL) {
  return {
    verifyPassword: (user, passwordForVerify) => {
      if (!!user.password && passwordHash.verify(user.password, passwordForVerify)) {
        return true;
      } else {
        return false;
      }
    }
  };
}