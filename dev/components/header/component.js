(function (angular) {
  'use strict';
  angular.module('app').component('appHeader', {
    templateUrl: 'components/header/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
      showFeedback: '&',
      closeFeedback: '&'
    }
  });

  ctrl.$inject = [
    '$location',
    '$mdSidenav',
    '$mdToast',
    'storage',
    'profileService',
    'notificationsService'
  ];
  function ctrl(
    $location,
    $mdSidenav,
    $mdToast,
    storage,
    profileService,
    notificationsService
  ) {
    var vm = this;
    var tokenName = 'x-biz-token';

    vm.user = null;
    vm.unreadedMessage = null;

    getNotifications();

    vm.isAuthenticated = !!storage.get(tokenName);
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

    vm.openConversation = function(conversationId, notificationId) {
      markAsRead(notificationId);
      $location.path('conversation/' + conversationId);
    };

    vm.onClose = function(id) {
      event.stopPropagation();
      markAsRead(id);
    };

    function getProfile() {
      profileService.getProfile().then(function(res) {
        vm.user = res.data;
      }).catch(function () {
        vm.user = null;
      });
    };

    function getNotifications () {
      notificationsService.getNotifications().then( function(res) {
        vm.notifications = res.data;
        console.log(res.data);

        vm.notifications.map( function (notification) {
          notification = notificationsService.messageGenerator(notification);
          notification.date = new Date(notification.date).toLocaleTimeString();
          return notification;
        });

        vm.notifications.sort( function(a, b) {
          return a.date < b.date ? 1 : -1;
        });
      }).catch(function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err.data.error)
            .position('bottom center')
            .hideDelay(5000)
        );
      });
    }

    function markAsRead (id) {
      notificationsService.markAsRead(id).then( function () {
        getNotifications();
      });
    }
  }
})(angular);
