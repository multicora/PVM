'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('conversationsService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.create = function (email, video) {
      var data = {
        "email": email,
        "video": video.id
      };

      return $http.post('/api/conversations', data);
    };

    this.get = function (id) {
      return $http.get('/api/conversations/' + id);
    };

    this.getTemplate = function (id) {
      return $http.get('/api/template/' + id);
    };

    this.updateTemplate = function (data) {
      return $http.post('/api/update-template', data);
    };
  }
})(angular);