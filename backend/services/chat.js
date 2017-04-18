'use strict';

module.exports = function (server, DAL) {
  var io = require('socket.io')(server.listener);

  // io.set('log level', 1);

  io.sockets.on('connection', function (socket) {
    // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
    var ID = socket.id.toString().substr(0, 5);

    socket.on('message', function (data, cb) {
      console.log(data);
      var date = new Date();
      data.date = date;
      DAL.chat.add(data);
      socket.broadcast.emit('income', data);
      cb();
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
      var date = new Date();
      var time = date.toLocaleTimeString();
      io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });
  });
};
