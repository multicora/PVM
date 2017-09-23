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
      return $http.get('/api/v2/chat/' + id);
    };

    this.videoWatched = function (data) {
      return $http.post('/api/video-watched', data);
    };

    this.videoIsWatching = function (data) {
      return $http.post('/api/video-is-watching', data);
    };

    this.fileDownloaded = function (data) {
      return $http.post('/api/file-downloaded', data);
    };

    this.videoPaused = function (data) {
      return $http.post('/api/video-paused', data);
    };

    this.getChatForDashboard = function () {
      return $http.get('/api/chat-for-dashboard');
    };

    this.sendMessage = function (conversationId, data) {
      return $http.post('/api/v2/chat/' + conversationId, data);
    };
  }
})(angular);
