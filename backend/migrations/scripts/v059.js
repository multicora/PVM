'use strict';

module.exports = function(DAL) {
  return {
    version: 59,
    message: 'Add "isRead" to "notifications" table',
    script: function (next) {
      DAL.notifications.addColumnIsRead(next);
    }
  };
};
