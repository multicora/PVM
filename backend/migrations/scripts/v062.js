'use strict';

module.exports = function(DAL) {
  return {
    version: 62,
    message: 'Delete columns `viewed`, `videoIsWatched`, `file_is_downloaded` from conversations table',
    script: function (next) {
      DAL.conversations.deleteColomns(next);
    }
  };
};
