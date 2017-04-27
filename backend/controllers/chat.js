'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
// const template = require('../services/mailTemplate.js');

module.exports = function (DAL) {
  let timersArr = [];

  function createTimer(conversationId, userId) {
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
      obj[conversationId][userId] = setTimeout(function() {sendNotification(userId)},
        config.notification.time * 60000);
      timersArr.push(obj);
    }
  };

  function sendNotification (userId) {
    DAL.users.getUserById(userId).then(res => {
      const message = 'You have new message!';

      const mail = {
        to: res.email,
        subject: 'Notification about new message',
        text: message,
        html: '<div style="white-space: pre;">' + message + '</div>'
      };

      console.log('NOTIFICATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 'user -> ' + userId);
    });
  };

  return {
    sendChatToDb: (data) => {
      return DAL.chat.add(data);
    },

    startTimer: (conversationId, userId) => {
      DAL.chat.getByConversationId(conversationId).then(res => {
        var usersArr = [];
        res.map(data => {
          if (usersArr.indexOf(data.authorId) === -1 && data.authorId !== userId) {
            usersArr.push(data.authorId);
          }
        });

        usersArr.forEach(id => {
          createTimer(conversationId, id);
        });
      });
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
