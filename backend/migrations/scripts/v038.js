'use strict';

module.exports = function(DAL) {
  return {
    version: 38,
    message: 'Add "logo" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnLogo(next);
    }
  };
};
