(function (angular) {
  'use strict';
  angular.module('app').component('appHeader', {
    templateUrl: 'components/header/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
    }
  });

  ctrl.$inject = [
    '$location',
    '$mdSidenav',
    'tokenService',
    'profileService',
    'notificationsService'
  ];
  function ctrl(
    $location,
    $mdSidenav,
    tokenService,
    profileService,
    notificationsService
  ) {
    var vm = this;

    vm.isAuthenticated = !!tokenService.getToken();
    getProfile();

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

    notificationsService.getNotifications().then( function(res) {
      console.log(res);
    });

    vm.openMenu = function () {
      $mdSidenav('left').toggle();
    };

    vm.invalidateSession = function () {
      tokenService.clearToken();
      $location.path('/login');
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      });
    };
  }
})(angular);
