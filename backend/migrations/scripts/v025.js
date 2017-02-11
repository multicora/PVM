module.exports = function(DAL) {
  'use strict';

  const Promise = require('promise');

  return {
    version: 25,
    message: 'Change "author" data type in "videos" table',
    script: function (next) {
      DAL.videos.changeDataType_author(next);
    }
  }
};