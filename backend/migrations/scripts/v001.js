'use strict';

module.exports = function(DAL) {
  return {
    version: 1,
    message: 'Created videos table',
    script: function (next) {
      DAL.videos.createTable(next);
    }
  };
};