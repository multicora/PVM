'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('usersService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getUsers = function () {
      return $http.get('/api/users');
    };

    this.blockUser = function (id) {
      return $http.post('/api/block-user', id);
    };

    this.unblockUser = function (id) {
      return $http.post('/api/unblock-user', id);
    };
  }
})(angular);