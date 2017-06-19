(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('storage', service);

  service.$inject = ['$localStorage'];
  function service($localStorage) {
    this.set = function (name, data) {
      $localStorage[name] = data;

      return $localStorage[name];
    };

    this.get = function (name) {
      return $localStorage[name];
    };

    this.clear = function (name) {
      return delete $localStorage[name];
    };
  }
})(angular);
