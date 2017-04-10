'use strict';

module.exports = function(DAL) {
  return {
    version: 44,
    message: 'Add "confirmedToken" in "users" table',
    script: function (next) {
      DAL.users.addColumnConfirmToken(next);
    }
  };
};
