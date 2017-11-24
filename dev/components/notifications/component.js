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
    '$mdToast',
    'notificationsService'
  ];
  function ctrl(
    $location,
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
        if (res.data !== []){
          vm.notifications = res.data;

          vm.notifications.map( function (notification) {
            return notificationsService.messageGenerator(notification);
          });

          vm.notifications.sort( function(a, b) {
            return a.date < b.date ? 1 : -1;
          });
        }
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
