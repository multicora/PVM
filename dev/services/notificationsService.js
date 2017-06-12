(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('notificationsService', service);

  service.$inject = ['$http'];
  function service($http) {
    var messages = {
      'FILE_IS_DOWNLOADED': 'file is downloaded in conversation with ',
      'VIDEO_IS_WATCHED': 'video is watched in conversaion with ',
      'VIDEO_IS_WATCHING': 'video is watching in conversation with ',
      'CONVERSATION_IS_OPENED': 'conversation was opened by ',
      'NEW_MESSAGE': 'new message from '
    };

    this.getNotifications = function () {
      return $http.get('/api/notifications');
    };

    this.markAsReaded = function (id) {
      return $http.get('/api/notification-readed/' + id);
    };

    this.messageGenerator = function (notification) {
      notification.metadata = JSON.parse(notification.metadata);

      if (notification.metadata) {
        notification.message = messages[notification.message] + notification.metadata.email;
      }

      return notification;
    };
  }
})(angular);
