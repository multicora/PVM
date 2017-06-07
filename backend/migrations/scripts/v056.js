'use strict';

module.exports = function(DAL) {
  return {
    version: 56,
    message: 'Change "wideo_is_watched" to "wideoIsWatched" field name in "conversations" table',
    script: function (next) {
      DAL.conversations.changeVideoIsWatchedFieldName(next);
    }
  };
};
