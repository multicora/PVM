'use strict';
(function(angular) {
  var app = angular.module('app');

  app.service('chat', service);

  service.$inject = ['$q'];
  function service($q) {
    var strings = {
      'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
      'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
      'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
      'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
      'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
    };
    var socket;

    socket = io();

    this.connect = function () {
      return $q(function (resolve) {
        socket.on('connect', function () {
          socket.on('message', function (msg) {
            console.log('----------------');
            console.log(msg.event + ': ' + msg.time);
            console.log(msg.name + ': ' + msg.text);
          });

          resolve({
            send: function (msg) {
              socket.send(escape(msg));
            },

            message: function (msg) {
              console.log(111111111);
            }
          });
        });
      });
    };

  }
})(angular);