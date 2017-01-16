'use strict';

module.exports = function(DAL) {
  return {
    version: 24,
    message: 'Change "author" data type in "videos" table',
    script: function (next) {
      DAL.videos.changeDataType_author(next);
    }
  }
};