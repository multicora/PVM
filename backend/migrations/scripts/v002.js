'use strict';

module.exports = function(DAL) {
  return {
    version: 2,
    message: 'Add "external_file_name" in "videos" table',
    script: function (next) {
      DAL.videos.addColumn_externalFileName(next);
    }
  }
};