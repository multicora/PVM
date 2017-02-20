'use strict';

module.exports = function(DAL) {
  return {
    version: 11,
    message: 'Create table "rolesToUser"',
    script: function (next) {
      DAL.roles.createTableRolesToUser(next);
    }
  };
};