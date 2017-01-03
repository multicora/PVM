'use strict';

module.exports = function(DAL) {
  return {
    version: 8,
    message: 'Add "resetToken" in "users" table',
    script: function (next) {
      DAL.users.addColumn_resetToken(next);
    }
  }
};