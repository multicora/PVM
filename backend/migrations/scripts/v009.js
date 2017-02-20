'use strict';

module.exports = function(DAL) {
  return {
    version: 9,
    message: 'Add "blocked" in "users" table',
    script: function (next) {
      DAL.users.addColumnBlocked(next);
    }
  };
};