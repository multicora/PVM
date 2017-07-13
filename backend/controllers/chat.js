'use strict';
const config = require('../config.js');
const mailer = require('../services/mailer.js');
const templates = require('../services/templates.js')();
const notificationsMessageGenerator = require('../services/notificationsMessageGenerator.js')();

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
      let result = null;
      if (!res.length) {
        result = DAL.chat.addStatus(data.conversationId, data.userId);
      } else if (!res.notified) {
        result = DAL.chat.markAsNotified(data.conversationId, data.userId);
        timersArr[key] = setTimeout(timerFunction.bind(null, data),
          config.notification.time * minute);
      }

      return result;
    });
  };

  function sendNotification (data) {
    let user;
    let author;
    DAL.users.getUserById(data.userId).then((res) => {
      user = res;
      return DAL.users.getUserById(data.authorId);
    }).then( res => {
      author = res;
      author.firstName = author.firstName || '';
      author.secondName = author.secondName || '';

      return DAL.notifications.add(
        notificationsMessageGenerator.newMessage(), user.id, data.conversationId, {
          'firstName': author.firstName,
          'secondName': author.secondName
        }
      );
    }).then( () => {
      return templates.newMessage(data.url, user.firstName, author.firstName + ' ' + author.secondName);
    }).then( template => {

      const mail = {
        to: user.email,
        subject: 'Notification about new message!',
        text: template.text,
        html: template.html,
        from: author.firstName + ' ' + author.secondName || 'Bizkonect'
      };

      mailer(config).send(mail);
    });
  };

  function sendChatToDb (data) {
    return DAL.chat.add(data);
  };

  function startTimer (data) {
    let conversation;
    DAL.conversations.getById(data.conversationId).then( res => {
      conversation = res;

      return DAL.chat.getByConversationId(data.conversationId);
    }).then( res => {
      var usersArr = [];

      res.filter(chat => {
        if (usersArr.indexOf(chat.authorId) === -1 && chat.authorId !== data.authorId) {
          usersArr.push(chat.authorId);
        }
      });

      if (usersArr.indexOf(conversation.author) === -1 && data.authorId !== conversation.author) {
        usersArr.push(conversation.author);
      }

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
    DAL.chat.markAsUnNotified(conversationId, userId);
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
