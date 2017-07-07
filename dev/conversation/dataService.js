(function(angular) {
  'use strict';
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

    this.getChat = function (id) {
      return $http.get('/api/chat/' + id);
    };

    this.videoWatched = function (id) {
      return $http.get('/api/video-watched/' + id);
    };

    this.videoIsWatching = function (id) {
      return $http.get('/api/video-is-watching/' + id);
    };

    this.fileDownloaded = function (data) {
      return $http.post('/api/file-downloaded', data);
    };

    this.getChatForDashboard = function () {
      return $http.get('/api/chat-for-dashboard');
    };
  }
})(angular);
