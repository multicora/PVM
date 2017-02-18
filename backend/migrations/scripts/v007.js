'use strict';

module.exports = function(DAL) {
  return {
    version: 7,
    message: 'Add "viewed" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnViewed(next);
    }
  };
};