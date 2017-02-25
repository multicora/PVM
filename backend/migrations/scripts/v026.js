'use strict';

module.exports = function(DAL) {
  return {
    version: 26,
    message: 'Add foreign key "author" in "videos" table',
    script: function (next) {
      DAL.videos.addForeignKeyAuthor(next);
    }
  };
};
