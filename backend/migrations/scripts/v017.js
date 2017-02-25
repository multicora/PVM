'use strict';

module.exports = function(DAL) {
  return {
    version: 17,
    message: 'Create table "actions"',
    script: function (next) {
      DAL.actions.createTableActions(next);
    }
  };
};
