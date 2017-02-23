'use strict';

module.exports = function(DAL) {
  return {
    version: 30,
    message: 'Chage type of "photo" colamn in "users" table',
    script: function (next) {
      DAL.users.changeUserPhotoType(next);
    }
  };
};