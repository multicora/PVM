'use strict';

module.exports = function(DAL) {
  return {
    version: 23,
    message: 'Add "author" in "videos" table',
    script: function (next) {
      DAL.videos.addColumnAuthor(next);
    }
  };
};