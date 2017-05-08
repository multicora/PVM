'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
// const template = require('../services/mailTemplate.js');

module.exports = function (DAL) {
  let timersArr = {};

  function createKey(conversationId, userId) {
    return conversationId + '_' + userId;
  };

  function createTimer(data) {
    let key = createKey(data.conversationId, data.userId);

    timersArr[key] = setTimeout(function () { sendNotification(data); },
      config.notification.time * 60000);
  };

  function sendNotification (data) {
    let email;
    DAL.users.getUserById(data.userId).then((res) => {
      email = res.email;
      return DAL.users.getUserById(data.authorId);
    }).then((res) => {
      const message = 'You have new message from ' + res.firstName + ' ' + res.secondName;

      const mail = {
        to: email,
        subject: 'Notification about new message!',
        text: message,
        html: '<div style="white-space: pre;">' + message + '</div>'
      };

      mailer(config).send(mail);
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
        createTimer({
          conversationId: conversationId,
          userId: id,
          authorId: userId
        });
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
