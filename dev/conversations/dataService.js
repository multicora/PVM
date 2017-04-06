'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('conversationsService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.create = function (data) {
      return $http.post('/api/conversations', data);
    };

    this.createPublic = function (data) {
      return $http.post('/api/conversations-public', data);
    };

    this.get = function (id) {
      return $http.get('/api/conversations/' + id);
    };

    this.getByAuthor = function () {
      return $http.get('/api/conversations');
    };

    this.getVideo = function (id) {
      return $http.get('/api/videos/' + id);
    };

    this.getTemplate = function (id) {
      return $http.get('/api/template/' + id);
    };

    this.updateTemplate = function (data) {
      return $http.post('/api/update-template', data);
    };

    this.createTemplate = function (data) {
      return $http.post('/api/template', data);
    };
  }
})(angular);