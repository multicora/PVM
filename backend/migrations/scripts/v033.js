'use strict';

module.exports = function(DAL) {
  return {
    version: 33,
    message: 'Add "super admin" in "users" table',
    script: function (next) {
      let userId;
      let roleId;
      DAL.users.addUser('super-admin', 'super-admin', 'super-admin@admin.com', 'super-admin')
        .then(res => {
          return DAL.roles.addRole('super-admin');
        }).then(res => {
        return DAL.users.getUserForLogin('super-admin@admin.com');
        }).then(res => {
          userId = res.id;
          return userId;
        }).then(() => {
          return DAL.roles.getRoleByName('super-admin');
        }).then(res => {
          roleId = res.id;
          return DAL.roles.addRoleToUser(userId, roleId);
        }).then(res => {
          return DAL.actions.addAction('CAN_EDIT_ADMINS');
        }).then(res => {
          return DAL.actions.getActionByName('CAN_EDIT_ADMINS');
        }).then((res) => {
          return DAL.actions.addActionToRole(res.id, roleId);
        }).then(res => {
          next();
        });
    }
  };
};