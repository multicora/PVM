(function (angular) {
  'use strict';
  angular.module('app').component('loginForm', {
    templateUrl: 'components/loginForm/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    transclude: true,
    bindings: {
      onSuccessLogin: '&'
    }
  });

  ctrl.$inject = [
    '$location',
    '$mdDialog',
    'authService',
    'storage',
    'translations',
    'loadingService'
  ];
  function ctrl(
    $location,
    $mdDialog,
    authService,
    storage,
    translations,
    loadingService
  ) {
    var vm = this;
    var isFetching = false;
    var tokenName = 'x-biz-token';
    var EMAIL_IS_NOT_CONFIRMED = 'EMAIL_IS_NOT_CONFIRMED';
    var unconfirmedEmailPopup = $mdDialog.confirm({
      title: translations.txt('CONFIRM_YOUR_EMAIL'),
      textContent: translations.txt('LOGIN_PAGE_CONFIRM_YOUR_EMAIL_MESSAGE'),
      ok: translations.txt('RESEND_CONFIRMATION'),
      cancel: translations.txt('CANCEL')
    });

    vm.authenticate = function(login, password) {
      isFetching = true;
      loadingService.showSpinner();

      if (!isFetching) {
        authService.login(login, password).then(function (res) {
          isFetching = false;
          loadingService.hideSpinner();

          storage.set(tokenName, res.data.token);
          vm.onSuccessLogin();
        }, function(err) {
          isFetching = false;
          loadingService.hideSpinner();

          if (err.data.message === EMAIL_IS_NOT_CONFIRMED) {
            $mdDialog
              .show( unconfirmedEmailPopup ).then(function() {
                authService.resendConfirmMail(login);
              });
          } else {
            vm.errorLogin = translations.txt(err.data.message);
          }
        });
      }
    };

    vm.register = function(email, password, confirmPassword) {
      authService.register(email, password, confirmPassword).then(function() {
        vm.errorRegister = '';
        vm.selectedIndex = 0;
      }, function(err) {
        vm.errorRegister = err.data.message;
      });
    };

    vm.forgotPassword = function() {
      $location.path('/reset-password');
    };
  }
})(angular);
