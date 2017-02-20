'use strict';

module.exports = function(DAL) {
  return {
    version: 4,
    message: 'Created users table',
    script: function (next) {
      DAL.users.createTable(next);
    }
  };
};