'use strict';

module.exports = function(DAL) {
  return {
    version: 41,
    message: 'Add "is_public" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnIsPublic(next);
    }
  };
};
