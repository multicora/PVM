(function (angular) {
  'use strict';
  angular.module('app').component('notifications', {
    templateUrl: 'components/notifications/tpl.html',
    controller: ctrl,
    controllerAs: 'vm',
    bindings: {
    }
  });

  ctrl.$inject = [
    '$location',
    '$mdSidenav',
    '$mdToast',
    'notificationsService'
  ];
  function ctrl(
    $location,
    $mdSidenav,
    $mdToast,
    notificationsService
  ) {
    var vm = this;

    getNotifications();

    vm.openConversation = function(conversationId, notificationId) {
      markAsRead(notificationId);
      $location.path('conversation/' + conversationId);
    };

    vm.onClose = function(id) {
      event.stopPropagation();
      markAsRead(id);
    };

    function getNotifications () {
      notificationsService.getNotifications().then( function(res) {
        vm.notifications = res.data;

        vm.notifications.map( function (notification) {
          notification = notificationsService.messageGenerator(notification);
          notification.localDate = new Date(notification.date).toLocaleDateString();
          notification.localTime = new Date(notification.date).toLocaleTimeString();
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