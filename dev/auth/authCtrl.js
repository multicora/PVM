(function (angular) {
  var app = angular.module('app');

  app.controller('authCtrl', ctrl);

  ctrl.$inject = [
    '$location',
    '$routeParams',
    '$mdDialog',
    'authService',
    'tokenService'
  ];
  function ctrl(
    $location,
    $routeParams,
    $mdDialog,
    authService,
    tokenService
  ) {
    var vm = this;
    var EMAIL_IS_NOT_CONFIRMED = 'EMAIL_IS_NOT_CONFIRMED';
    var unconfirmedEmailPopup = $mdDialog.confirm({
      title: 'Confirm your email!',
      textContent: 'We send you mail, please check your mailbox.',
      ok: 'Resend confirmation',
      cancel: 'Cancel'
    });

    if ($routeParams.confirmToken) {
      authService.loginConfirm($routeParams.confirmToken).then(function (res) {
        tokenService.setToken(res.data.token);
        $location.path('/');
      });
    } else {
      vm.authenticate = function(login, password) {
        authService.login(login, password).then(function (res) {
          if (res.data.key === EMAIL_IS_NOT_CONFIRMED) {
            $mdDialog
              .show( unconfirmedEmailPopup ).then(function() {
                authService.resendConfirmMail(login);
              });
          } else {
            tokenService.setToken(res.data.token);
            $location.path('/');
          }
        }, function(err) {
          vm.errorMessage = err.data.message;
        });
      }

      vm.register = function(email, password, confirmPassword) {
        authService.register(email, password, confirmPassword).then(function(res) {
          vm.errorRegister = '';
          $location.path('/login');
        }, function(err) {
          vm.errorRegister = err.data.message;
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
  }
})(angular);