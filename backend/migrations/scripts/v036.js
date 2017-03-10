'use strict';

module.exports = function(DAL) {
  return {
    version: 36,
    message: 'Add "title" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnTitle(next);
    }
  };
};
