'use strict';

module.exports = function (server, DAL) {
  const chatCtrl = require('../controllers/chat.js')(DAL);
  const webSocket = require('../services/webSocket.js');

  webSocket(server).then((socketService) => {
    socketService.on('chatMessage', function (data, socket) {
      chatCtrl.incomeMessage(data);
      socket.broadcast.emit('income', data);
    });
    socketService.on('read', function (data) {
      chatCtrl.clearTimer(data.conversationId, data.authorId);
    });
  });
};
