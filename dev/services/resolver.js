(function(angular) {
  'use strict';

  var app = angular.module('app');

  app.service('resolver', service);

  service.$inject = [
    '$location',
    '$q',
    'authService',
    'UserCheckingService',
    'tokenService'
  ];

  function service(
    $location,
    $q,
    authService,
    UserCheckingService,
    tokenService
  ) {
    this.get = function (action, path) {
      return _.bind(function () {
        return resolve(action, path);
      }, this);
    };

    this.tokenChecker = function () {
      return _.bind(function () {
        return $q(function (resolve) {
          tokenService.getToken() ? resolve() : redirect('/login');
        });
      }, this);
    };

    function resolve (action, path) {
      return $q(function (resolve) {
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
          function () {
            resolve();
          }
        );
      });
    };

    function redirect(url) {
      $location.path(url);
    }
  }
})(angular);
