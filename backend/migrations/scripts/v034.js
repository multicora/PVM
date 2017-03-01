'use strict';

module.exports = function(DAL) {
  return {
    version: 34,
    message: 'Add company to all users',
    script: function (next) {
      const usersId = [];

      DAL.users.getAllUsers().then((users) => {
        users.map((user) => {
          if (!user.company || user.company === 'null') {
            usersId.push(user.id);
          }
        });
        let promises = usersId.map(() => {
          return DAL.company.add();
        });
        return Promise.all(promises);
      }).then(company => {
        const usersArr = [];
        for (let i = 0; i < usersId.length; i++) {
          usersArr.push({'id': usersId[i], 'company': company[i].insertId});
        }

        let usersPromises = usersArr.map(user => {
          return DAL.users.updateUserCompany(user);
        });
        return Promise.all(usersPromises);
      }).then(() => {
        next();
      });
    }
  };
};
