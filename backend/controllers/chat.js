'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
// const template = require('../services/mailTemplate.js');

module.exports = function (DAL) {
  var timersArr = [];

  return {
    sendChatToDb: (data) => {
      return DAL.chat.add(data);
    },

    startTimer: (conversationId, userId) => {
      var changed = 0;

      timersArr.map(item => {
        if (item[conversationId]) {
          item[conversationId][userId] = sendNotification(userId);
          changed++;
        }
      });

      if (!changed) {
        var obj = {};
        obj[conversationId] = {};
        obj[conversationId][userId] = sendNotification(userId);
        timersArr.push(obj);
      }

      function sendNotification (userId) {
        DAL.users.getById(userId).then(res => {
          const message = 'You have new message!';

          const mail = {
            to: res.email,
            subject: 'Notification about new message',
            text: message,
            html: '<div style="white-space: pre;">' + message + '</div>'
          };

          return setTimeout(mailer(config).send(mail), config.notification.time * 60000);
        });
      };
    },

    clearTimer: (conversationId, userId) => {
      timersArr.map(item => {
        if (item[conversationId][userId]) {
          clearTimeout(item[conversationId][userId]);
        }
      });
    },
  };
};
