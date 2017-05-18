'use strict';

module.exports = function(DAL) {
  return {
    version: 50,
    message: 'Rename "is_watched" in "conversations" table',
    script: function (next) {
      DAL.conversations.renameColumnIsWatched(next);
    }
  };
};
