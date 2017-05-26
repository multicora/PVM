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
      let filesArr = [];

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
        let promises = [];

        res.forEach(file => {
          filesArr.push(file.id_file);
        });

        filesArr.forEach(id => {
          promises.push(DAL.files.getById(id));
        });

        return Promise.all(promises);
      }).then( res => {
        let promises = [];
        conversation.files = [];

        res.forEach(file => {
          conversation.files.push({name: file.name});
        });

        filesArr.forEach(id => {
          promises.push(storageCtrl.getFile(id));
        });

        return Promise.all(promises);
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
