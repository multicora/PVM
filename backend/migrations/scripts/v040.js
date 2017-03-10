'use strict';

module.exports = function(DAL) {
  return {
    version: 40,
    message: 'Add "name" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnName(next);
    }
  };
};
