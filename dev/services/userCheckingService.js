(function(angular) {
  'use strict';

  angular
    .module('app')
    .factory('UserCheckingService', UserCheckingService);


  UserCheckingService.$inject = [];

  function UserCheckingService() {
    return {
      checkUser: checkUser
    };

    function checkUser(user, roles, action) {
      var answer = false;
      if (user.roles) {
        var rolesMap = {};
        var usersActions = [];

        roles.forEach(function (roles) {
          rolesMap[roles.name] = roles;
        });

        user.roles.forEach(function (roles) {
          rolesMap[roles].actions.forEach(function (name, i) {
            usersActions = usersActions.concat(rolesMap[roles].actions[i].name);
          });
        });
        answer = usersActions.indexOf(action) >= 0;
      }
      return answer;
    }
  }
})(angular);
