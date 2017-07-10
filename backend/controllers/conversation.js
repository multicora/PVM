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
      let filesArr;

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
        conversation.url = buffer;

        return DAL.files.getFilesByConversation(conversationId);
      }).then( res => {
        filesArr = res.map(file => file.id_file);

        return Promise.all(
          filesArr.map(id => DAL.files.getById(id))
        );
      }).then( res => {
        conversation.files = res.map((file) => {
          return {
            name: file.name,
            id: file.id
          };
        });

        return Promise.all(
          filesArr.map(id => storageCtrl.getFile(id))
        );
      }).then(res => {
        for (let i = 0; i < conversation.files.length; i++) {
          conversation.files[i].url = res[i];
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
    },
    needToSendPromise: (conversation, token) => {
      return new Promise((resolve) => {
        usersCtrl.getUserByToken(token.value).then((user) => {
          if (conversation.author === user.id) {
            resolve(false);
          } else {
            resolve(true);
          }
        }, () => {
          resolve(true);
        });
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
