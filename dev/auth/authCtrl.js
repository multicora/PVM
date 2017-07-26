(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('authCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    '$routeParams',
    'authService',
    'storage'
  ];
  function ctrl(
    $location,
    $routeParams,
    authService,
    storage
  ) {
    var vm = this;
    var tokenName = 'x-biz-token';

    vm.errorMessage = null;

    if ($routeParams.confirmToken) {
      authService.loginConfirm($routeParams.confirmToken).then(function (res) {
        storage.set(tokenName, res.data.token);
        $location.path('/');
      });
    }

    vm.onSuccessLogin = function() {
      $location.path('/');
    };

    vm.sendResetRequest = function (email) {
      authService.reset(email).then(function() {
        vm.errorMessage = null;
        vm.successMessage = 'A letter with the link for resetting password has been sent to your email.';
      }).catch(function (err) {
        vm.errorMessage = err.data.message;
        vm.successMessage = null;
      });
    };

    vm.setPassword = function (newPassword, confirmPassword) {
      authService.setPassword(newPassword, confirmPassword, $routeParams.token).then(
        function() {
          $location.path('/');
        },
        function(err) {
          vm.errorMessage = err.data.message;
      });
    };
  }
})(angular);
