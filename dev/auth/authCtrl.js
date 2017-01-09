(function (angular) {
  var app = angular.module('app');

  app.controller('authCtrl', ctrl);

  ctrl.$inject = ['$location', 'authService', 'tokenService'];
  function ctrl($location, authService, tokenService) {
    var vm = this;

    vm.authenticate = function(login, password) {
      authService.login(login, password).then(function (res) {
        if (res.data.error) {
          vm.errorMessage = res.data.message;
        } else {
          tokenService.setToken(res.data.token);
          $location.path('/');
          // TODO: browser should ask to store password
        }
      });
    }
  }
})(angular);