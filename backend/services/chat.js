'use strict';

module.exports = function (server, DAL) {
  var io = require('socket.io')(server.listener);

  io.sockets.on('connection', function (socket) {
    var ID = socket.id.toString().substr(0, 5);

    socket.on('message', function (data, cb) {
      var date = new Date();
      data.date = date;
      DAL.chat.add(data);
      socket.broadcast.emit('income', data);
      cb();
    });

    socket.on('disconnect', function() {
    });
  });
};
