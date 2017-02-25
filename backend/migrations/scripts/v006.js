'use strict';

module.exports = function(DAL) {
  return {
    version: 6,
    message: 'Created conversations table',
    script: function (next) {
      DAL.conversations.createTable(next);
    }
  };
};
