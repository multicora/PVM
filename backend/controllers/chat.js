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

    DAL.chat.getStatus(data.conversationId, data.userId).then(res => {
      return res;
    }).then(status => {
      let result = null;
      if (!status.length) {
        result = DAL.chat.addStatus(data.conversationId, data.userId);
      } else {

        if (!status.notified) {
          result = DAL.chat.markAsNotified(data.conversationId, data.userId);
          timersArr[key] = setTimeout(timerFunction.bind(null, data),
            config.notification.time * minute);
        }
      }

      return result;
    });
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
          usersArr.push(data.authorId);
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
    DAL.chat.markAsUnNotifiedStatus(conversationId, userId);
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
