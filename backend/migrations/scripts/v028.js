'use strict';

module.exports = function(DAL) {
  return {
    version: 28,
    message: 'Add "phone", "company", "company_position", "photo" in "users" table',
    script: function (next) {
      DAL.users.addColumnsForProfile(next);
    }
  };
};
