'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
const templates = require('../services/templates.js')();

module.exports = function (DAL) {
  const minute = 60000;
  let timersArr = {};

  function createKey (conversationId, userId) {
    return conversationId + '_' + userId;
  };

  function createTimer (data) {
    let key = createKey(data.conversationId, data.userId);

    function timerFunction (data) {
      sendNotification(data);
    }

    timersArr[key] = setTimeout(timerFunction.bind(null, data),
      config.notification.time * minute);
  };

  function sendNotification (data) {
    let user;
    DAL.users.getUserById(data.userId).then((res) => {
      user = res;
      return DAL.users.getUserById(data.authorId);
    }).then( res => {
      return templates.newMessage(data.url, user.firstName, res.firstName + ' ' + res.secondName);
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

  function startTimer (data) {
    DAL.chat.getByConversationId(data.conversationId).then( res => {
      var usersArr = [];

      res.filter(chat => {
        if (usersArr.indexOf(chat.authorId) === -1 && chat.authorId !== data.userId) {
          usersArr.push(chat.authorId);
        }
      });

      usersArr.map(id => {
        createTimer({
          conversationId: data.conversationId,
          userId: id,
          authorId: data.authorId,
          url: data.url
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
        startTimer(data);
      });
    },
    clearTimer: clearTimer
  };
};
