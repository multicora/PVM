'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('chat', service);

  service.$inject = [
    '$q',
    'pubSub',
    'authService'
    ];
  function service(
    $q,
    pubSub,
    authService
  ) {
    var socket;
    var currentUser;
    socket = io();

    this.connect = function () {
      return $q(function (resolve) {
        socket.on('connect', function () {
          authService.getCurrentUser().then(function(res) {
            currentUser = res.data.id;
          });
          socket.on('income', function (data) {
            pubSub.emit('incomeMessage', data);
            socket.emit('read', {
              type: 'read',
              content: {
                conversationId: data.conversationId,
                userId: currentUser
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