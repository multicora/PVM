'use strict';

module.exports = function(DAL) {
  return {
    version: 43,
    message: 'Confirmed exists users',
    script: function (next) {
      DAL.users.getAll().then((res) => {
        let promises = res.map((user) => {
          return DAL.users.confirmEmail(user.id);
        });
        return Promise.all(promises);
      }).then(() => {
        next();
      });
    }
  };
};
