'use strict';
const config = require('../config.js');
// const mailer = require('../services/mailer.js');
// const template = require('../services/mailTemplate.js');

module.exports = function (DAL) {
  let timersArr = {};

  function createKey(conversationId, userId) {
    return conversationId + '_' + userId;
  };

  function createTimer(conversationId, userId) {
    let key = createKey(conversationId, userId);

    timersArr[key] = setTimeout(function () { sendNotification(userId); },
      config.notification.time * 60000);
  };

  function sendNotification (userId) {
    DAL.users.getUserById(userId).then(() => {
      // const message = 'You have new message!';

      // const mail = {
      //   to: res.email,
      //   subject: 'Notification about new message',
      //   text: message,
      //   html: '<div style="white-space: pre;">' + message + '</div>'
      // };
      console.log('NOTIFICATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 'user -> ' + userId);
    });
  };

  function sendChatToDb (data) {
    return DAL.chat.add(data);
  };

  function startTimer (conversationId, userId) {
    DAL.chat.getByConversationId(conversationId).then(res => {
      var usersArr = [];

      res.filter(data => {
        if (usersArr.indexOf(data.authorId) === -1 && data.authorId !== userId) {
          usersArr.push(data.authorId);
        }
      });

      usersArr.map(id => {
        createTimer(conversationId, id);
      });
    });
  };

  function clearTimer (conversationId, userId) {
    let key = createKey(conversationId, userId);
    clearTimeout(timersArr[key]);
  };

  return {
    incomeMessage: function(data) {
      sendChatToDb(data).then(res => {
        data.id = res.insertId;
        startTimer(data.conversationId, data.authorId);
      });
    },
    clearTimer: clearTimer
  };
};
