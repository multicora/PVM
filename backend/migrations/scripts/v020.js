'use strict';

module.exports = function(DAL) {
  return {
    version: 20,
    message: 'Add action "CAN_SEE_USERS_PAGE" to "admin" role',
    script: function (next) {
      let roleId;
      DAL.roles.getRoleByName('admin')
      .then((res) => {
        roleId = res.id;
        return roleId;
      }).then(() => {
        return DAL.actions.getActionByName('CAN_SEE_USERS_PAGE');
      }).then((res) => {
        return DAL.actions.addActionToRole(res.id, roleId);
      }).then((res) => {
        next();
      });
    }
  };
};