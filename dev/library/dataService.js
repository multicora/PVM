'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('libraryService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getVideos = function () {
      return $http.get('/api/videos');
    };

    this.getThumbnails = function () {
      return $http.get('/api/thumbnails');
    }

    this.getTemplates = function () {
      return $http.get('/api/templates');
    };
  }
})(angular);