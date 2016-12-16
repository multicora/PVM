'use strict'

module.exports = function(connection){
  let DAL = {};

  // Conversations
  DAL.conversations = require('./conversations.js')(connection);

  // Users
  DAL.users = require('./users.js')(connection);

  // Video
  DAL.videos = require('./video.js')(connection);

  // Settings
  DAL.settings = require('./settings.js')(connection);

  return DAL;
};