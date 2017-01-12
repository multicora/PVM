'use strict';

module.exports = function(DAL) {
  return {
    version: 18,
    message: 'Create table "rolesToActions"',
    script: function (next) {
      DAL.actions.createTableRolesToActions(next);
    }
  }
};