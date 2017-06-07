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

    notificationsService.getNotifications().then( function(res) {
      vm.notifications = res.data;
      vm.notifications.map( function (notification) {
        notification.date = new Date(notification.date).toLocaleTimeString();
        return notification;
      });
      vm.notifications.sort( function(a, b) {
        if (a.date < b.date) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    vm.isAuthenticated = !!tokenService.getToken();
    getProfile();

    vm.redirect = function(url, urlParam) {
      if (urlParam) {
        return $location.path(url + '/' + urlParam);
      } else {
        return $location.path(url);
      }
    };

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
