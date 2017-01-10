'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('usersService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getUsers = function () {
      return $http.get('/api/users');
    };
  }
})(angular);