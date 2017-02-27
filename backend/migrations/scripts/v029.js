'use strict';

module.exports = function(DAL) {
  return {
    version: 29,
    message: 'Chage type of "logo" colamn in "company" table',
    script: function (next) {
      DAL.users.changeTypeOfColumn('company', 'logo', 'BLOB', next);
    }
  };
};
