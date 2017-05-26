'use strict';

module.exports = function(DAL) {
  return {
    version: 53,
    message: 'Add table "files_to_conversations"',
    script: function (next) {
      DAL.files.createTableFilesToConversations(next);
    }
  };
};
