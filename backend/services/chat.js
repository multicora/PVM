'use strict';

module.exports = function (server, DAL) {
  var io = require('socket.io')(server.listener);

  // io.set('log level', 1);

  io.sockets.on('connection', function (socket) {
    // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
    var ID = socket.id.toString().substr(0, 5);
    // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
    socket.json.send({'event': 'connected successful'});
    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (data) {
      var date = new Date();
      data.date = date;
      DAL.chat.add(data);
      socket.emit('income', data);
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
      var date = new Date();
      var time = date.toLocaleTimeString();
      io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });
  });
};
