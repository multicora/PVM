(function (angular) {
  'use strict';
  var app = angular.module('app');

  app.controller('authCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    '$routeParams',
    '$mdDialog',
    'authService',
    'tokenService',
    'translations'
  ];
  function ctrl(
    $location,
    $routeParams,
    $mdDialog,
    authService,
    tokenService,
    translations
  ) {
    var vm = this;
    var EMAIL_IS_NOT_CONFIRMED = 'EMAIL_IS_NOT_CONFIRMED';
    var unconfirmedEmailPopup = $mdDialog.confirm({
      title: translations.txt('CONFIRM_YOUR_EMAIL'),
      textContent: translations.txt('LOGIN_PAGE_CONFIRM_YOUR_EMAIL_MESSAGE'),
      ok: translations.txt('RESEND_CONFIRMATION'),
      cancel: translations.txt('CANCEL')
    });

    if ($routeParams.confirmToken) {
      authService.loginConfirm($routeParams.confirmToken).then(function (res) {
        tokenService.setToken(res.data.token);
        $location.path('/');
      });
    } else {
      vm.authenticate = function(login, password) {
        authService.login(login, password).then(function (res) {
          tokenService.setToken(res.data.token);
          $location.path('/');
        }, function(err) {
          if (err.data.message === EMAIL_IS_NOT_CONFIRMED) {
            $mdDialog
              .show( unconfirmedEmailPopup ).then(function() {
                authService.resendConfirmMail(login);
              });
          } else {
            vm.errorMessage = translations.txt(err.data.message);
          }
        });
      };

      vm.register = function(email, password, confirmPassword) {
        authService.register(email, password, confirmPassword).then(function() {
          vm.errorRegister = '';
          vm.selectedIndex = 0;
          // $location.path('/login');
        }, function(err) {
          vm.errorRegister = err.data.message;
        });
      };

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
      };

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
      };
    }
  }
})(angular);
