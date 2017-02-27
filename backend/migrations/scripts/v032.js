'use strict';

module.exports = function(DAL) {
  return {
    version: 32,
    message: 'Chage types of "logo" colamn in "company" table',
    script: function (next) {
      DAL.users.changeTypeOfColumn('company', 'logo', 'MEDIUMBLOB', next);
    }
  };
};
