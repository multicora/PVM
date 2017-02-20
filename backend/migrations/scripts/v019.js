'use strict';

module.exports = function(DAL) {
  return {
    version: 19,
    message: 'Add actions "CAN_SEE_USERS_PAGE, CAN_EDIT_USERS, CAN_INVITE_USERS"',
    script: function (next) {
      DAL.actions.addAction('CAN_SEE_USERS_PAGE').then((res) => {
        return res;
      }).then(() => {
        return DAL.actions.addAction('CAN_EDIT_USERS');
      }).then(() => {
        return DAL.actions.addAction('CAN_INVITE_USERS');
      }).then(() => {
        next();
      });
    }
  };
};