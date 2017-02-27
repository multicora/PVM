'use strict';

(function(angular) {
  var app = angular.module('app');

  app.service('resolver', service);

  service.$inject = [
    '$q',
    'authService',
    'UserCheckingService',
    '$location'
  ];

  function service(
    $q,
    authService,
    UserCheckingService,
    $location
  ) {
    this.get = function (action, path) {
      return _.bind(function () {
        return resolve(action, path);
      }, this);
    };
    function resolve (action, path) {
      return  $q(function (resolve) {
        $q.all([authService.getCurrentUser(), authService.getRoles()]).then(
          function (res) {
            var user = res[0].data;
            var roles = res[1].data;
            authService.setUser(res[0].data);

            if (action && !UserCheckingService.checkUser(user, roles, action) && $location.path().match(path)) {
              authService.redirectByRole(user.roles);
            }
            resolve();
          },
          function (errRes) {
            resolve();
          }
        );
      })
    };
  }
})(angular);