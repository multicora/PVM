'use strict';

module.exports = function() {
  return {
    version: 55,
    message: 'Change "company_position" to "companyPosition" field name in "conversations" table',
    script: function (next) {
      next();
    }
  };
};
