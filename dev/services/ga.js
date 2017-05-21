'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('ga', service);

  service.$inject = [];
  function service() {
    this.send = function (type, fields) {
      ga('send', type, fields);
    };
  }
})(angular);