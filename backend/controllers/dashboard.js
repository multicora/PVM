'use strict';

module.exports = function(DAL){
  return {
    get: () => {
      return DAL.settings.getByName('timeToBeOnline').then(
        (res) => DAL.users.getOnline(res[0].value)
      ).then(
        (res) => ({
          usersOnline: res,
        })
      );
    },
  };
};
