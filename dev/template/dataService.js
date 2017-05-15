'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('templateService', service);

  service.$inject = ['$http'];
  function service($http) {
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