'use strict';

module.exports = function(DAL) {
  return {
    version: 27,
    message: 'Created company table',
    script: function (next) {
      DAL.users.createTableCompany(next);
    }
  };
};