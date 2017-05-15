'use strict';

module.exports = function(DAL) {
  return {
    version: 46,
    message: 'Create table chatStatus',
    script: function (next) {
      DAL.chat.createTableChatStatus(next);
    }
  };
};
