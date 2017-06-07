(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('notificationsService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getNotifications = function () {
      return $http.get('/api/notifications');
    };
  }
})(angular);
