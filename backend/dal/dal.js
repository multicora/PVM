'use strict';

module.exports = function(connection){
  let DAL = {};

  // Conversations
  DAL.conversations = require('./conversations.js')(connection);

  // Templates
  DAL.templates = require('./templates.js')(connection);

  // Users
  DAL.users = require('./users.js')(connection);

  // Video
  DAL.videos = require('./video.js')(connection);

  // Settings
  DAL.settings = require('./settings.js')(connection);

  // Roles
  DAL.roles = require('./roles.js')(connection);

  // Actions
  DAL.actions = require('./actions.js')(connection);

  // Company
  DAL.company = require('./company.js')(connection);

  // Chat
  DAL.chat = require('./chat.js')(connection);

  return DAL;
};
