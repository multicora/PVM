(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('notificationsService', service);

  service.$inject = [
    '$http',
    'translations'
  ];
  function service(
    $http,
    translations
  ) {

    this.getNotifications = function () {
      return $http.get('/api/notifications');
    };

    this.markAsRead = function (id) {
      return $http.get('/api/notification-read/' + id);
    };

    this.messageGenerator = function (notification) {
      notification.metadata = JSON.parse(notification.metadata);

      if (notification.metadata) {
        notification.message = translations.txt(notification.message) + notification.metadata.email;
      }

      return notification;
    };
  }
})(angular);
