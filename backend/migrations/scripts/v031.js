'use strict';

module.exports = function(DAL) {
  return {
    version: 31,
    message: 'Chage types of "photo" colamn in "users" table',
    script: function (next) {
      DAL.users.changeTypeOfColumn('users', 'photo', 'MEDIUMBLOB', next);
    }
  };
};
