'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('authService', service);

  service.$inject = [
    '$http',
    '$location'
  ];
  function service(
    $http,
    $location
  ) {
    var user = null;
    
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

    this.setPassword = function (newPassword, confirmPassword, resetToken) {
      var data = {
        'newPassword': passwords.newPassword,
        'confirmPassword': passwords.confirmPassword,
        'resetToken': resetToken
      };

      return $http.post('api/new-password', data);
    }

    this.getCurrentUser = function() {
      return $http.get('api/currentUser');
    }

    this.getRoles = function () {
      return $http.get('api/roles');
    }

    this.setUser = function (newUser) {
      user = newUser;
      return user;
    }

    this.redirectByRole = function (roles) {
      var map = {
        'admin': '/admin'
      };
      var pathArray = roles.map(function (role) {
        return role.name;
      }).map(function (name) {
        return map[name];
      }).filter(function (mapRole) {
        return mapRole;
      });

      if (pathArray.length > 0) {
        $location.path(pathArray[0]);
      } else {
        $location.path('/').search('param', null);
      }
    }
  }
})(angular);