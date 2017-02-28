'use strict';

module.exports = function(DAL) {
  return {
    version: 35,
    message: 'Add "is_template" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnIsTemplate(next);
    }
  };
};
