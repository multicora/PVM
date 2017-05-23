'use strict';
// const uuid = require('node-uuid');
// const separator = '_';

module.exports = function(DAL) {
  const usersCtrl = require('./users.js')(DAL);
  const notificationsCtrl = require('./notifications.js')(DAL);
  const storageCtrl = require('./storage.js')(DAL);

  return {
    get: (id) => {
      let conversationId = id;
      let conversation;

      // Finding conversation
      return DAL.conversations.getById(conversationId).then((res) => {
        conversation = parseConversation(res);

        return conversation;
      }).then(() => {
        // Get author information
        return DAL.users.getUserById(conversation.author);
      }).then((user) => {
        conversation.authorEmail = user.email;
        conversation.authorPhone = user.phone;
        conversation.authorPhoto = user.photo ? user.photo.toString() : null;

        return conversation;
      }).then(() => {
        return storageCtrl.getVideo(conversation.videoId);
      }).then((buffer) => {
        let result = null;

        conversation.url = buffer;
        if (conversation.file) {
          result = DAL.files.getById(conversation.file);
        }

        return result;
      }).then( res => {
        let result = null;
        if (res) {
          conversation.file = res;
          result = storageCtrl.getFile(conversation.file.id);
        }

        return result;
      }).then(res => {
        if (res) {
          conversation.file.url = res;
        }

        return conversation;
      });
    },
    needToMarkAsViewed: function (conversation, token) {
      const isViewed = !!conversation.viewed;

      return usersCtrl.getUserByToken(token).then((user) => {
        if (conversation.author === user.id) {
          return false;
        } else {
          return !isViewed;
        }
      }).catch(() => {
        return !isViewed;
      });
    },
    markAsViewed: (conversation, serverUrl) => {
      return DAL.conversations.markAsViewed(conversation.id).then(() => {
        return notificationsCtrl.conversationOpened(conversation, serverUrl + '/conversation/' + conversation.id);
      });
    }
  };
};

function parseConversation(conversation) {
  let newConversation = Object.assign({}, conversation);

  if (newConversation.logo) {
    newConversation.logo = newConversation.logo.toString();
  } else {
    newConversation.logo = null;
  }

  return newConversation;
}
