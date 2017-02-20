'use strict';

module.exports = function(DAL) {
  const Promise = require('promise');

  return {
    version: 25,
    message: 'Change "author" data type in "videos" table',
    script: function (next) {
      DAL.videos.changeDataTypeAuthor(next);
    }
  };
};