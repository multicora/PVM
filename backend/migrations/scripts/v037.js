'use strict';

module.exports = function(DAL) {
  return {
    version: 37,
    message: 'Add "message" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnMessage(next);
    }
  };
};
