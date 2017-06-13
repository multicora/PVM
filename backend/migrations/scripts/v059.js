'use strict';

module.exports = function(DAL) {
  return {
    version: 59,
    message: 'Add "isReaded" to "notifications" table',
    script: function (next) {
      DAL.notifications.addColumnIsReaded(next);
    }
  };
};
