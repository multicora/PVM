(function (angular) {
  var app = angular.module('app');

  app.controller('authCtrl', ctrl);

  ctrl.$inject = ['$location', '$routeParams', 'authService', 'tokenService'];
  function ctrl($location, $routeParams, authService, tokenService) {
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

    vm.sendResetRequest = function (email) {
      authService.reset(email).then(
        function(res) {
          if (res.data.error) {
            vm.errorMessage = res.data.message;
            vm.successMessage = null;
          } else {
            vm.errorMessage = null;
            vm.successMessage = 'A letter with the link for resetting password has been sent to your email.';
          }
        }
      );
    }

    vm.setPassword = function (newPassword, confirmPassword) {
      authService.setPassword(newPassword, confirmPassword, $routeParams.token).then(
        function(res) {
          if (res.data.error) {
            vm.errorMessage = res.data.message;
          } else {
            $location.path('/');
          }
        }
      );
    }
  }
})(angular);