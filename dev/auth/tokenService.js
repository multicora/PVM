(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('tokenService', service);

  service.$inject = [];
  function service() {
    this.tokenName = 'x-biz-token';

    this.setToken = function (token) {
      return localStorage.setItem('biz.authToken', token);
    };

    this.getToken = function () {
      return localStorage.getItem('biz.authToken');
    };

    this.clearToken = function () {
      return localStorage.removeItem('biz.authToken');
    };
  }
})(angular);
