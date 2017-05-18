'use strict';

module.exports = function(DAL) {
  return {
    version: 48,
    message: 'Add "video_is_watched" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnIsWatched(next);
    }
  };
};
