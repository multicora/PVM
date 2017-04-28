'use strict';
module.exports = function (server) {
const pubSub = require('../services/pubSub.js')();

  var io = require('socket.io')(server.listener);

  io.sockets.on('connection', function (socket) {

    socket.on('message', function (data, cb) {
      pubSub.emit('incomeMessage', data);
      // socket.broadcast.emit('income', data);

      cb();
    });

    socket.on('disconnect', function() {
    });
  });
};
