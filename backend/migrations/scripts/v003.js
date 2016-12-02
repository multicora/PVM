'use strict';

module.exports = function(DAL) {
  return {
    version: 3,
    message: 'Add "external_file_id" in "videos" table',
    script: function (next) {
      DAL.videos.addColumn_externalFileId(next);
    }
  }
};