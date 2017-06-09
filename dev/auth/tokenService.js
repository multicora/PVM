(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('tokenService', service);

  service.$inject = ['$localStorage'];
  function service($localStorage) {
    this.tokenName = 'x-biz-token';

    this.setToken = function (token) {
      $localStorage['biz.authToken'] = token;

      return $localStorage['biz.authToken'];
    };

    this.getToken = function () {
      return $localStorage['biz.authToken'];
    };

    this.clearToken = function () {
      return delete $localStorage['biz.authToken'];
    };
  }
})(angular);
