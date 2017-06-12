'use strict';

module.exports = function(DAL) {
  return {
    version: 58,
    message: 'Add "metadata" to "notifications" table',
    script: function (next) {
      DAL.notifications.addColumnMetadata(next);
    }
  };
};
