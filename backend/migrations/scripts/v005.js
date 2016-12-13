'use strict';

module.exports = function(DAL) {
  return {
    version: 5,
    message: 'Add "user" in "users" table',
    script: function (next) {
      DAL.users.addUser('Robert', 'Mon', 'user@user.com', 'user', next);
    }
  }
};