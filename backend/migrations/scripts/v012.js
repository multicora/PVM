'use strict';

module.exports = function(DAL) {
  return {
    version: 12,
    message: 'Add "permanent" in "users" table',
    script: function (next) {
      DAL.users.addColumn_permanent(next);
    }
  }
};