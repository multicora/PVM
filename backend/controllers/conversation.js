'use strict';

const Promise = require('promise');
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
        if (res) {
          conversation = parseConversation(res);

          return conversation;
        }

        return Promise.reject({
          code: 404,
        });
      }).then(() => {
        // Get author information
        return DAL.users.getUserById(conversation.author);
      }).then((user) => {
        conversation.authorEmail = user.email;
        conversation.authorPhone = user.phone;
        conversation.authorPhoto = user.photo ? user.photo.toString() : null;

        return conversation;
      }).then(() => {
        // Get video url
        return storageCtrl.getVideoUrl(conversation.videoId);
      }).then((url) => {
        conversation.url = url;

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
    getConversations: conversations => {
      return new Promise((resolve, reject) => {
        let promises = [];

        conversations.forEach( conversation => {
          promises.push(DAL.chat.getByConversationId(conversation.id));
        });

        return Promise.all(promises).then( res => {
          let chats = [];

          res.map(function(chat) {
            var lastChat = chat[0];
            for (var i = 0; i < chat.length; i++) {
              if (lastChat.date < chat[i].date) {
                lastChat = chat[i];
              }
            }

            chats.push(lastChat);
          });

          conversations.forEach(function(conversation) {
            conversation.lastMessage = null;
            conversation.lastMessageAuthor = null;

            chats.forEach(function(chat) {
              if (chat && chat.conversationId === conversation.id) {
                conversation.lastMessage = chat.message;
                conversation.lastMessageAuthor = chat.authorId;
              }
            });
          });

          let promisesArr = [];

          conversations.forEach( conversation => {
            if (conversation.lastMessageAuthor) {
              promisesArr.push(DAL.users.getUserById(conversation.lastMessageAuthor));
            }
          });

          return Promise.all(promisesArr);
        }).then( res => {
          conversations.forEach(function(conversation) {
            res.forEach(function(user) {
              if (user.id === conversation.lastMessageAuthor) {
                conversation.lastMessageAuthor = user.firstName || null;
              }
            });
          });

          resolve(conversations);
        }, err => {
          reject(err);
        });
      });
    },
    needToMarkPromise: function(token, author, email) {
      return new Promise((resolve) => {
        usersCtrl.getUserByToken(token).then(res => {
          if (author === res.id) {
            resolve({
              user: res,
              result: false
            });
          } else {
            resolve({
              user: res,
              result: true
            });
          }
        }, () => {
          return DAL.users.getUserByEmail(email);
        }).then( res => {
            resolve({
              user: res,
              result: true
            });
        }, () => {
            resolve({
              user: null,
              result: true
            });
        });
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
