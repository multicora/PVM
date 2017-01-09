'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('libraryService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getVideos = function () {
      return $http.get('/api/videos');
    };
  }
})(angular);