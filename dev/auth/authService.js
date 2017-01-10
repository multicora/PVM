'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('authService', service);

  service.$inject = ['$http'];
  function service($http) {
    this.login = function (login, password) {
      return $http.post('/api/login', {
        login: login,
        password: password
      });
    };
  }
})(angular);