'use strict';

module.exports = function(DAL) {
  return {
    version: 39,
    message: 'Add "company_role" in "conversations" table',
    script: function (next) {
      DAL.conversations.addColumnCompanyRole(next);
    }
  };
};
