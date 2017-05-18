'use strict';

module.exports = function(DAL) {
  return {
    version: 49,
    message: 'Add "updated" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnUpdated(next);
    }
  };
};
