'use strict';

module.exports = function(DAL) {
  return {
    version: 10,
    message: 'Create table "roles"',
    script: function (next) {
      DAL.roles.createTableRoles(next);
    }
  };
};
