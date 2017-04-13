'use strict';

module.exports = function (server, DAL) {
  var io = require('socket.io')(server.listener);

  // io.set('log level', 1);

  io.sockets.on('connection', function (socket) {
    // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
    var ID = socket.id.toString().substr(0, 5);
    var date = new Date();
    var time = date.toLocaleTimeString();
    // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
    socket.json.send({'event': 'connected', 'name': ID, 'time': time});
    // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
    socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (data) {
      var date = new Date();
      data.date = date;
      // var time = date.toLocaleTimeString();
      DAL.chat.add(data);
      // Уведомляем клиента, что его сообщение успешно дошло до сервера
      // socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
      // Отсылаем сообщение остальным участникам чата
      // socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time});
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
      var date = new Date();
      var time = date.toLocaleTimeString();
      io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });
  });
};
