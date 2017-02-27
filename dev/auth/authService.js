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

    this.reset = function (email) {
      var data = {'email': email};

      return $http.post('api/reset-password', data);
    }

    this.register = function (email, password, confirmPassword) {
      var data = {
        'email': email,
        'password': password,
        'confirmPassword': confirmPassword
      };

      return $http.post('api/register', data);
    }

    this.setPassword = function (newPassword, confirmPassword, resetToken) {
      var data = {
        'newPassword': newPassword,
        'confirmPassword': confirmPassword,
        'resetToken': resetToken
      };

      return $http.post('api/new-password', data);
    }
  }
})(angular);