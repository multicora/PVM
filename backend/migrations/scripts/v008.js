'use strict';

module.exports = function(DAL) {
  return {
    version: 6,
    message: 'Add "author" in "videos" table',
    script: function (next) {
      DAL.videos.addColumn_author(next);
    }
  }
};