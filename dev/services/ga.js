(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('ga', service);

  service.$inject = [];
  function service() {
    // Example
    // ga('send', 'event', 'link', 'click', 'http://example.com', {
    //   nonInteraction: true
    // });
    this.send = function (type, eventCategory, eventAction, eventLabel, eventValue) {
      ga('send', type, eventCategory, eventAction, eventLabel, eventValue);
    };
  }
})(angular);
