'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
const templates = require('../services/templates.js')();

module.exports = function (DAL) {
  const minute = 60000;
  let timersArr = {};

  function createKey(conversationId, userId) {
    return conversationId + '_' + userId;
  };

  function createTimer(data) {
    let key = createKey(data.conversationId, data.userId);

    timersArr[key] = setTimeout(function () { sendNotification(data); },
      config.notification.time * minute);
  };

  function sendNotification (data) {
    let user;
    DAL.users.getUserById(data.userId).then((res) => {
      user = res;
      return DAL.users.getUserById(data.authorId);
    }).then( res => {
      return templates.newMessage('http://', user.firstName, res.firstName + ' ' + res.secondName);
    }).then( template => {

      const mail = {
        to: user.email,
        subject: 'Notification about new message!',
        text: template.text,
        html: template.html
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
