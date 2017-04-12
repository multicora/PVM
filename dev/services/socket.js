'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('socket', service);

  service.$inject = ['$rootScope'];
  function service($rootScope) {
    var socket = io.connect();

    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;

          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },

      emit: function(eventName, data, callback) {
          socket.emit(eventName, data, function() {
              var args = arguments;
              $rootScope.$apply(function() {
                  if (callback) {
                      callback.apply(socket, args);
                  }
              });
          });
      }
    }
  }
})(angular);