'use strict';

module.exports = function (server, DAL) {
  const chatCtrl = require('../controllers/chat.js')(DAL);
  var io = require('socket.io')(server.listener);

  io.sockets.on('connection', function (socket) {

    socket.on('message', function (data, cb) {
      chatCtrl.sendChatToDb(data).then(() => {
        socket.broadcast.emit('income', data);
      }, err => {
        console.log('error', err);
      });
      cb();
    });

    socket.on('disconnect', function() {
    });
  });
};
