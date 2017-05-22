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
    };

    this.getTemplates = function () {
      return $http.get('/api/templates');
    };

    this.getConversations = function () {
      return $http.get('/api/conversations');
    };

    this.getFiles = function () {
      return $http.get('/api/files');
    };

    this.deleteTemplate = function (id) {
      return $http.post('/api/delete-template', id);
    };

    this.deleteVideo = function (id) {
      return $http.post('/api/delete-video', id);
    };
  }
})(angular);