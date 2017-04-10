'use strict';

module.exports = function(DAL) {
  return {
    version: 42,
    message: 'Add "confirmed" in "users" table',
    script: function (next) {
      DAL.users.addColumnConfirmed(next);
    }
  };
};
