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
            socket.emit('read', {
              type: 'read',
              content: {
                conversationId: data.conversationId,
                authorId: data.authorId
              }
            });
          });

          resolve({
            send: function (msg, cb) {
              var data = {
                content: msg,
                type: 'chatMessage'
              };

              socket.emit('message', data, cb);
            }
          });
        });

      });
    };

  }
})(angular);