'use strict';

module.exports = function(DAL) {
  return {
    version: 16,
    message: 'Add role "admin" to "admin@admin.com" user',
    script: function (next) {
      let userId;
      DAL.users.getUserForLogin('admin@admin.com')
      .then((res) => {
        userId = res.id;
        return userId;
      }).then(() => {
        return DAL.roles.getRoleByName('admin');
      }).then((res) => {
        let roleId = res.id;
        return DAL.roles.addRoleToUser(userId, roleId);
      }).then((res) => {
        next();
      });
    }
  }
};