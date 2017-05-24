'use strict';

module.exports = function(DAL) {
  return {
    version: 54,
    message: 'Add "file_is_downloaded" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnFileIsDownloaded(next);
    }
  };
};
