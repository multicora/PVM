'use strict';

module.exports = function(DAL) {
  return {
    version: 21,
    message: 'Add action "CAN_EDIT_USERS" to "admin" role',
    script: function (next) {
      let roleId;
      DAL.roles.getRoleByName('admin')
      .then((res) => {
        roleId = res.id;
        return roleId;
      }).then(() => {
        return DAL.actions.getActionByName('CAN_EDIT_USERS');
      }).then((res) => {
        return DAL.actions.addActionToRole(res.id, roleId);
      }).then((res) => {
        next();
      });
    }
  };
};