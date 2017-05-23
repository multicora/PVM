'use strict';

module.exports = function(DAL) {
  return {
    version: 53,
    message: 'Add column "file" to conversations table',
    script: function (next) {
      DAL.conversations.addColumnFile(next);
    }
  };
};
