'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
// const template = require('../services/mailTemplate.js');

module.exports = function (DAL) {
  const timersArr = [];

  function createKey(conversationId, userId) {
    return conversationId + '_' + userId;
  };

  function createTimer(conversationId, userId) {
    let key = createKey(conversationId, userId);
    var changed = 0;

    timersArr.map(item => {
      if (item[key]) {
        item[key] = setTimeout(function () { sendNotification(userId) },
          config.notification.time * 60000);
        changed++;

      }
    });

    if (!changed) {
      var obj = {};
      obj[key] = setTimeout(function () { sendNotification(userId) },
        config.notification.time * 60000);
      timersArr.push(obj);
      console.log('pushed', timersArr);
    }

    console.log('timersArr', timersArr);
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
      console.log('start', timersArr);
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
      console.log('clear', timersArr);
      let key = createKey(conversationId, userId);
      timersArr.map(item => {
        if (item[key]) {
          clearTimeout(item[key]);
        }
      });
    },
  };
};
