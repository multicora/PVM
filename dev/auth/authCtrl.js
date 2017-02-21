(function (angular) {
  var app = angular.module('app');

  app.controller('authCtrl', ctrl);

  ctrl.$inject = ['$location', '$routeParams', 'authService', 'tokenService', '$q', '$scope'];
  function ctrl($location, $routeParams, authService, tokenService, $q, $scope) {
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

    vm.register = function(email, password, confirmPassword) {
      authService.register(email, password, confirmPassword).then(function(res) {
        if (res.data.error) {
          vm.errorRegister = res.data.message;
        } else {
          $location.path('/login');
        }
      }, function(err) {
        vm.errorRegister = res.data.message;
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

    $scope.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    }
  }
})(angular);