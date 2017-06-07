'use strict';

module.exports = function(DAL) {
  return {
    version: 56,
    message: 'Add "notifications" table',
    script: function (next) {
      DAL.notifications.createTable(next);
    }
  };
};
