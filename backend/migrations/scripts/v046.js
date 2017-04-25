'use strict';

module.exports = function(DAL) {
  return {
    version: 46,
    message: 'Add column is_viewed to chat table',
    script: function (next) {
      DAL.chat.addColumnIsViewed(next);
    }
  };
};
