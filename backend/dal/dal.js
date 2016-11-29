'use strict'

module.exports = function(connection){
  let DAL = {};

  // Video
  DAL.videos = require('./video.js')(connection);

  // Settings
  DAL.settings = require('./settings.js')(connection);

  return DAL;
};