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

    getNotifications();

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

    vm.markAsRead = function(id) {
      notificationsService.markAsRead(id).then( function () {
        getNotifications();
      });
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      });
    };

    function getNotifications () {
      notificationsService.getNotifications().then( function(res) {
        vm.notifications = res.data;
        vm.notifications.map( function (notification) {
          notification = notificationsService.messageGenerator(notification);
          notification.date = new Date(notification.date).toLocaleTimeString();
          return notification;
        });
        vm.notifications.sort( function(a, b) {
          return a.date < b.date ? 1 : -1;
        });
      });
    }
  }
})(angular);
