'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('chat', service);

  service.$inject = [
    '$q',
    'pubSub'
    ];
  function service(
    $q,
    pubSub
  ) {
    var socket;

    socket = io();

    this.connect = function () {
      return $q(function (resolve) {
        socket.on('connect', function () {

          socket.on('income', function (data) {
            pubSub.emit('incomeMessage', data);
          });

          socket.on()

          resolve({
            send: function (msg, cb) {
              socket.emit('message', msg, cb);
            }
          });
        });

      });
    };

  }
})(angular);