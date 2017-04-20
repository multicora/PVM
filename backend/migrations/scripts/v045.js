'use strict';

module.exports = function(DAL) {
  return {
    version: 45,
    message: 'Created chat table',
    script: function (next) {
      DAL.chat.createTable(next);
    }
  };
};
