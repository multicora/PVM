'use strict';

module.exports = function(DAL) {
  return {
    version: 25,
    message: 'Change "author" data type in "videos" table',
    script: function (next) {
      DAL.videos.changeDataTypeAuthor(next);
    }
  };
};
