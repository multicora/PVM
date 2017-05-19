'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('feedbacksService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.send = function (data) {
      return $http.post('/api/feedback', data);
    };
  }
})(angular);