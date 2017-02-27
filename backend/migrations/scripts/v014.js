'use strict';

module.exports = function(DAL) {
  return {
    version: 14,
    message: 'Add "permanent" to "admin"',
    script: function (next) {
      DAL.users.permanentUser('admin@admin.com').then(()=>{next();});
    }
  };
};
