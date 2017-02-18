'use strict';

module.exports = function(DAL) {
  return {
    version: 15,
    message: 'Add role "admin"',
    script: function (next) {
      DAL.roles.addRole('admin').then(()=>{next();});
    }
  };
};