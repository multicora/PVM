'use strict';

module.exports = function(DAL) {
  return {
    version: 13,
    message: 'Add "admin" in "users" table',
    script: function (next) {
      DAL.users.addUser('admin', 'admin', 'admin@admin.com', 'admin').then(()=>{next();});
    }
  };
};
