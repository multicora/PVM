(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('utils', service);

  function service() {
    this.createAudio = function(src) {
      return new Audio(src);
    };
  }
})(angular);
