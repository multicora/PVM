(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('usersService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.getUsers = function () {
      return $http.get('/api/users');
    };

    this.getUserById = function (id) {
      return $http.get('/api/user/' + id);
    };

    this.blockUser = function (id) {
      return $http.post('/api/block-user', id);
    };

    this.unblockUser = function (id) {
      return $http.post('/api/unblock-user', id);
    };

    this.updateUser = function (user) {
      return $http.post('/api/update-user', user);
    };

    this.inviteUser = function (email) {
      console.log(email);
      return $http.post('/api/invite-user', {'email': email});
    };
  }
})(angular);
