'use strict';

module.exports = function (server) {
  const Promise = require('promise');
  const io = require('socket.io')(server.listener);

  let listeners = [];

  return new Promise((resolve) => {
    io.sockets.on('connection', function (socket) {
      socket.on('message', function (data, cb) {
        // Every webSocket message should have property 'type' and 'content'
        const type = data.type;
        const content = data.content;

        if (listeners[type]) {
          listeners[type].forEach(function (fn) {
            fn(content, socket);
          });
        }

        cb();
      });

      socket.on('read', function (data) {
        const type = data.type;
        const content = data.content;

        if (listeners[type]) {
          listeners[type].forEach(function (fn) {
            fn(content, socket);
          });
        }
      });

      resolve({
        on: function (eventName, fn) {
          listeners[eventName] = listeners[eventName] || [];
          listeners[eventName].push(fn);
        },
        off: function (eventName, fn) {
          if (listeners[eventName]) {
            for (var i = 0; i < listeners[eventName].length; i++) {
              if (listeners[eventName][i] === fn) {
                listeners[eventName].splice(i, 1);
                break;
              }
            };
          }
        },
      });
    });
  });
};
