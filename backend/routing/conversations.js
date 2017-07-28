'use strict';

const Boom = require('boom');
const Promise = require('promise');
const mailer = require('../services/mailer.js');
const config = require('../config.js');
const templates = require('../services/templates.js')();
const utils = require('../utils.js');

module.exports = function (server, DAL) {
  const storageCtrl = require('../controllers/storage.js')(DAL);
  const usersCtrl = require('../controllers/users.js')(DAL);
  const notificationsCtrl = require('../controllers/notifications.js')(DAL);
  const conversationCtrl = require('../controllers/conversation.js')(DAL);

  server.route({
    method: 'POST',
    path: '/api/conversations',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        const author = request.auth.credentials;
        const data = request.payload;
        const serverUrl = utils.getServerUrl(request);
        let conversationId;
        data.author = author.id;

          DAL.conversations.create(data).then(res => {
            let promises = [];
            conversationId = res.insertId;

            data.files.forEach( id => {
              promises.push(DAL.files.addFileToConversation(id, conversationId));
            });

            return Promise.all(promises);
          }).then(() => {
            return templates.sendConversation(serverUrl + '/conversation/' +
              conversationId, data.name, data.title, data.message);
          }).then(template => {
            try {
              let fromInformation = author.email;
              if (author.firstName && author.secondName) {
                fromInformation = author.firstName + ' ' + author.secondName;
              }
              const from = [
                fromInformation + ' ',
                config.mail.defaultFrom
              ].join('');

              const mail = {
                from: from,
                to: data.email,
                subject: 'Video from ' + fromInformation, // Subject line
                text: template.text,
                html: template.html
              };
              mailer(config).send(mail).then(
                () => {
                  reply({'status': 'success'});
                }, (err) => {
                  reply( Boom.badImplementation(err.message, err) );
                }
              );
            } catch (err) {
              reply(Boom.badImplementation(err, err));
            }
          }, function(err) {
            reply(Boom.badImplementation(err));
          });
      }
    }
  });

  /**
   * @api {post} /api/conversations-public Request for create public conversation
   * @apiName CreateConversationPublic
   * @apiGroup Conversations
   *
   * @apiParam {string}   id                              Conversation id.
   *
   * @apiSuccess {String}   link               Conversation link.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {
   *   link: https://localhost:8081/conversation/107,
   * }
   */
  server.route({
    method: 'POST',
    path: '/api/conversations-public',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let author = request.auth.credentials;
        let data = request.payload;
        let serverUrl = utils.getServerUrl(request);
        data.author = author.id;
        data.public = 1;

        DAL.conversations.create(data).then(function (res) {
          reply({'link': serverUrl + '/conversation/' + res.insertId});
        }, function (err) {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/conversation/:id Request conversation
   * @apiName GetConversation
   * @apiGroup Conversations
   *
   * @apiParam {string}   id                              Conversation id.
   *
   * @apiSuccess {Object}   conversation                      Conversation.
   * @apiSuccess {String}   conversation.author               Conversation author.
   * @apiSuccess {String}   conversation.company_role         Conversation author company role.
   * @apiSuccess {String}   conversation.email                Conversation email.
   * @apiSuccess {String}   conversation.id                   Conversation id.
   * @apiSuccess {String}   conversation.is_template          Conversation is template.
   * @apiSuccess {String}   conversation.logo                 Conversation logo.
   * @apiSuccess {String}   conversation.message              Conversation message.
   * @apiSuccess {String}   conversation.title                Conversation title.
   * @apiSuccess {String}   conversation.url                  Conversation video url.
   * @apiSuccess {String}   conversation.authorEmail          Conversation author email.
   * @apiSuccess {String}   conversation.authorPhone          Conversation author phone.
   * @apiSuccess {String}   conversation.authorPhoto          Conversation author photo.
   * @apiSuccess {String}   conversation.videoId              Conversation video id.
   * @apiSuccess {String}   conversation.viwed                Conversation viewed.
   * @apiSuccess {Array}    conversation.files                Conversation files id.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {
   *   author: 4,
   *   company_role: "manager",
   *   email: "manager@gmail.com"
   *   id: 36,
   *   is_template: 0,
   *   logo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//",
   *   message: "hello world",
   *   name: "Jon",
   *   title: "hello world",
   *   url: "https://dl.boxcloud.com/d/1/ZNibCR5XsT6uQv5JHXN4WCk93aIi",
   *   authorEmail: "user@gmail.com"
   *   authorPhone: "43434343445",
   *   authorPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
   *   videoId: 7,
   *   viewed: 0,
   *   filse: [1, 2]
   * }
   */
  server.route({
    method: 'GET',
    path: '/api/conversations/{id}',
    config: {
      handler: function (request, reply) {
        let token = usersCtrl.parseToken(request.headers.authorization);
        let serverUrl = utils.getServerUrl(request);
        let conversation;
        let user;

        conversationCtrl.get(request.params.id).then((res) => {
          conversation = res;

          return conversationCtrl.needToMarkPromise(token.value, conversation.author, conversation.email);
        }).then(res => {
          user = res.user || {id: null};

          if (res.result) {
            return DAL.events.get(DAL.events.types.CONVERSATION_IS_VIEWED, user.id, conversation.id).then(res => {
              let result = null;

              if (!res.length) {
                result = notificationsCtrl.conversationOpened(conversation, serverUrl +
                  '/conversation/' +
                  conversation.id);
              }

              return result;
            }).then(() => {
              return DAL.events.add(DAL.events.types.CONVERSATION_IS_VIEWED, user.id, conversation.id, {});
            }).then(() => {
              return DAL.conversations.updateTime(conversation.id);
            });
          } else {
            return Promise.resolve();
          }
        }).then(() => {
          reply(conversation);
        }).catch((err) => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/video-is-watching Request for send notification about watching video.
   *
   * @apiParam {String}   conversationId               conversation id.
   * @apiParam {String}   videoId                      video id.
   *
   * @apiName VideoIsWatching
   * @apiGroup Conversations
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */

  server.route({
    method: 'POST',
    path: '/api/video-is-watching',
    config: {
      handler: function (request, reply) {
        let conversationId = request.payload.conversationId;
        let videoId = request.payload.videoId;
        let serverUrl = utils.getServerUrl(request);
        let token = usersCtrl.parseToken(request.headers.authorization);
        let conversation;
        let user;

        DAL.conversations.getById(conversationId).then(res => {
          conversation = res;
          return conversationCtrl.needToMarkPromise(token.value, conversation.author, conversation.email);
        }).then(res => {
          let result = null;
          user = res.user;

          if (res.result) {
            result = notificationsCtrl.videoIsWatching(conversation, serverUrl +
              '/conversation/' +
              conversation.id);
          }

          return result;
        }).then(() => {
          return DAL.events.add(DAL.events.types.VIDEO_IS_WATCHING, user.id, conversation.id, {
            'videoId': videoId
          });
        }).then(() => {
          return DAL.conversations.updateTime(conversation.id);
        }).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/video-watched Request for update conversation video watched status
   *
   * @apiParam {String}   conversationId               conversation id.
   * @apiParam {String}   videoId                      video id.
   *
   * @apiName VideoWatched
   * @apiGroup Templates
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */

  server.route({
    method: 'POST',
    path: '/api/video-watched',
    config: {
      handler: function (request, reply) {
        let conversationId = request.payload.conversationId;
        let videoId = request.payload.videoId;
        let serverUrl = utils.getServerUrl(request);
        let token = usersCtrl.parseToken(request.headers.authorization);
        let conversation;
        let user;

        DAL.conversations.getById(conversationId).then(res => {
          conversation = res;
          return conversationCtrl.needToMarkPromise(token.value, conversation.author, conversation.email);
        }).then(res => {
          user = res.user;

          if (res.result) {
            return DAL.events.get(DAL.events.types.VIDEO_IS_WATCHED, user.id, conversation.id).then(res => {
              let result = null;

              if (!res.length) {
                result = notificationsCtrl.videoWatched(conversation, serverUrl +
                  '/conversation/' +
                  conversation.id);
              }

              return result;
            }).then(() => {
              return DAL.events.add(DAL.events.types.VIDEO_IS_WATCHED, user.id, conversation.id, {
                'videoId': videoId
              });
            }).then(() => {
              return DAL.conversations.updateTime(conversation.id);
            });
          } else {
            return Promise.resolve();
          }
        }).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/file-downloaded Request for update conversation file downloaded status
   *
   * @apiParam {String}   conversationId               conversation id.
   * @apiParam {String}   fileId                       file id.
   *
   * @apiName VideoWatched
   * @apiGroup Templates
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */

  server.route({
    method: 'POST',
    path: '/api/file-downloaded',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let conversationId = request.payload.conversationId;
        let fileId = request.payload.fileId;
        let serverUrl = utils.getServerUrl(request);
        let token = usersCtrl.parseToken(request.headers.authorization);
        let conversation;
        let user;

        DAL.conversations.getById(conversationId).then(res => {
          conversation = res;
          return conversationCtrl.needToMarkPromise(token.value, conversation.author);
        }).then(res => {
          user = res.user;

          if (res.result) {
            return DAL.events.get(DAL.events.types.FILE_IS_DOWNLOADED, user.id, conversation.id).then(res => {
              let result = null;
              let isDownloaded = false;

              for (let i = 0; i < res.length; i++) {
                if (JSON.parse(res[i].metadata).fileId === fileId) {
                  isDownloaded = true;
                  break;
                }
              }

              if (!isDownloaded) {
                result = notificationsCtrl.fileDownloaded(conversation, serverUrl +
                  '/conversation/' +
                  conversation.id);
              }

              return result;
            }).then(() => {
              return DAL.events.add(DAL.events.types.FILE_IS_DOWNLOADED, user.id, conversation.id, {
                'fileId': fileId
              });
            }).then(() => {
              return DAL.conversations.updateTime(conversation.id);
            });
          } else {
            return Promise.resolve();
          }
        }).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/template/:id Request template
   * @apiName GetTemplate
   * @apiGroup Templates
   *
   * @apiParam {string}   id                              Template id.
   *
   * @apiSuccess {Object}   template                      Template information.
   * @apiSuccess {String}   template.id                   Template id.
   * @apiSuccess {String}   template.videoId              Template video id.
   * @apiSuccess {String}   template.author               Template author id.
   * @apiSuccess {String}   template.name                 Template author name.
   * @apiSuccess {String}   template.companyRole          Template author company role.
   * @apiSuccess {String}   template.title                Template title.
   * @apiSuccess {String}   template.message              Template message.
   * @apiSuccess {String}   template.videoUrl             Template video url.
   * @apiSuccess {String}   template.logo                 Template company logo.
   * @apiSuccess {Array}    template.files                Template files.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {
   *   id: 1,
   *   videoId: 4,
   *   author: 4,
   *   name: null,
   *   ompanyRole: null,
   *   title: null,
   *   message: null,
   *   logo: null,
   *   videoUrl: 'https://dl.boxcloud.com/d/1/Iu3ZkIwjP6VYkw90,
   *   files: [1, 2]
   * }
   */
  server.route({
    method: 'GET',
    path: '/api/template/{id}',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let data = {};
        DAL.templates.getById(request.params.id).then(res => {
          data.id = res.id;
          data.videoId = res.videoId;
          data.author = res.author;
          data.name = res.name;
          data.companyRole = res.company_role;
          data.title = res.title;
          data.message = res.message;
          if (res.logo) {
            data.logo = res.logo.toString();
          } else {
            data.logo = null;
          }
          return storageCtrl.getVideo(data.videoId);
        }).then( buffer => {
          data.videoUrl = buffer;

          return DAL.files.getFilesByConversation(request.params.id);
        }).then(res => {
          data.files = [];

          res.forEach(file => {
            data.files.push(file.id_file);
          });

          reply(data);
        }).catch( err => {
          if (err.message === '404') {
            reply(Boom.notFound(err.message, 'Not found'));
          } else {
            reply(Boom.badImplementation(err, err));
          }
        });
      }
    }
  });

  /**
   * @api {post} /api/update-template Request for update template
   *
   * @apiParam {Object}   newTemplate                  new template information.
   * @apiParam {String}   newTemplate.id               template id.
   * @apiParam {String}   newTemplate.title            new template title.
   * @apiParam {String}   newTemplate.name             new template user name.
   * @apiParam {String}   newTemplate.company_role     new template user company role.
   * @apiParam {String}   newTemplate.message          new template message.
   * @apiParam {String}   newTemplate.logo             new template company logo.
   * @apiParam {String}   newTemplate.videoId          new template video id.
   *
   * @apiName UpdateTemplate
   * @apiGroup Templates
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/update-template',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let data = request.payload;
        DAL.templates.update(data).then(() => {
          return DAL.files.deleteFilesFromConversation(data.id);
        }).then(() => {
          let promises = [];
          data.files.forEach( id => {
            promises.push(DAL.files.addFileToConversation(id, data.id));
          });

          return Promise.all(promises);
        }).then(() => {
          reply({'status': 'success'});
        }, err => {
          if (err.message === '404') {
            reply(Boom.notFound(err.message, 'Not found'));
          } else {
            reply(Boom.badImplementation(err, err));
          }
        });
      }
    }
  });

  /**
   * @api {post} /api/template Request for create template
   *
   * @apiParam {Object}   Template                  template information.
   * @apiParam {String}   Template.title            template title.
   * @apiParam {String}   Template.name             template user name.
   * @apiParam {String}   Template.company_role     template user company role.
   * @apiParam {String}   Template.message          template message.
   * @apiParam {String}   Template.logo             template company logo.
   * @apiParam {String}   Template.videoId          template video id.
   *
   * @apiName CreateTemplate
   * @apiGroup Templates
   *
   *
   * @apiSuccess {Object}   template         Template.
   * @apiSuccess {String}   template.id    Template id.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "templateId": "12"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/template',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let data = request.payload;
        let templateId;
        DAL.templates.create(data).then((res) => {
          templateId = res.insertId;
          let promises = [];

          data.files.forEach( id => {
            promises.push(DAL.files.addFileToConversation(id, templateId));
          });

          return Promise.all(promises);
        }).then(() => {
          reply({'templateId': templateId});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/templates Request templates
   * @apiName GetTemplates
   * @apiGroup Templates
   *
   * @apiSuccess {Object[]} templates                     List of templates.
   * @apiSuccess {String}   template.id                   Template id.
   * @apiSuccess {String}   template.title                Template title.
   * @apiSuccess {String}   template.message              Template message.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {[
   *   id: 1,
   *   title: null,
   *   message: null
   * ]}
   */
  server.route({
    method: 'GET',
    path: '/api/templates',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.templates.getByAuthor(request.auth.credentials.id).then(res => {
          reply(res);
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {post} /api/delete-template Request for delete template
   *
   * @apiParam {string}   id                              Template id.
   *
   * @apiName DeleteTemplate
   * @apiGroup Templates
   *
   *
   * @apiSuccess {Object}   status           Status.
   * @apiSuccess {String}   status.status    Status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success"
   *     }
   */
  server.route({
    method: 'POST',
    path: '/api/delete-template',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.templates.delete(request.payload).then(() => {
          reply({'status': 'success'});
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/conversations Request conversations
   * @apiName GetConversations
   * @apiGroup Conversations
   *
   * @apiSuccess {Object[]} conversations                     List of conversations.
   * @apiSuccess {String}   conversation.id                   Conversation id.
   * @apiSuccess {String}   conversation.title                Conversation title.
   * @apiSuccess {String}   conversation.message              Conversation message.
   * @apiSuccess {String}   conversation.viwed                Conversation video url.
   * @apiSuccess {String}   conversation.videoIsWatched     Conversation video is watched status.
   * @apiSuccess {String}   conversation.updated              Conversation updated.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {[
   *   id: 1,
   *   title: null,
   *   message: null,
   *   viewed: 1,
   *   updated: '0000-00-00 00:00:00',
   *   videoIsWatched: 1
   * ]}
   */
  server.route({
    method: 'GET',
    path: '/api/conversations',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        DAL.conversations.getByAuthor(request.auth.credentials.id).then(res => {
          return conversationCtrl.getConversations(res);
        }).then( res => {
          reply(res);
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/conversations-to-user Request conversations
   * @apiName GetConversations
   * @apiGroup Conversations
   *
   * @apiSuccess {Object[]} conversations                     List of conversations.
   * @apiSuccess {String}   conversation.id                   Conversation id.
   * @apiSuccess {String}   conversation.title                Conversation title.
   * @apiSuccess {String}   conversation.message              Conversation message.
   * @apiSuccess {String}   conversation.viwed                Conversation video url.
   * @apiSuccess {String}   conversation.author               Conversation author id.
   * @apiSuccess {String}   conversation.updated              Conversation updated.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {[
   *   id: 1,
   *   title: null,
   *   message: null,
   *   viewed: 1,
   *   author: 2,
   *   updated: '0000-00-00 00:00:00'

   * ]}
   */
  server.route({
    method: 'GET',
    path: '/api/conversations-to-user',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let conversations;
        DAL.conversations.getByEmail(request.auth.credentials.email).then(res => {
          let promises = [];
          conversations = res;

          conversations.forEach(conversation => {
            promises.push(DAL.users.getUserById(conversation.author));
          });

          return Promise.all(promises);
        }).then( res => {

          for (let i = 0; i < conversations.length; i++) {
            conversations[i].author = res[i].email;
          }

          return conversationCtrl.getConversations(conversations);
        }).then( res => {
          reply(res);
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/chat Request chat
   * @apiName GetChat
   * @apiGroup Chat
   *
   * @apiParam {string}   id                              Conversation id.
   *
   * @apiSuccess {Object[]} chat                          List of chat messages.
   * @apiSuccess {String}   chat.id                       Chat id.
   * @apiSuccess {String}   chat.authorId                 Author id.
   * @apiSuccess {String}   chat.conversationId           Conversation Id.
   * @apiSuccess {String}   chat.date                     Date.
   * @apiSuccess {String}   chat.message                  Message.
   * @apiSuccess {String}   chat.photo                    Author photo.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {[
   *   id: 1,
   *   authorId: 4,
   *   conversationId: 20,
   *   date: '0000-00-00 00:00:00',
   *   message: 'text',
   *   photo: <Buffer 64 61 74 61 3a 69 6d 61 67 65 2f 6a 70 65 67 3b 62 61 73 65 36 34 2c 2f 39 6a 2f 34 51 41 59 52 58 68 70 5a 67 41 41 53 55 6b 71 41 41 67 41 41 41 41 ... >
   * ]}
   */
  server.route({
    method: 'GET',
    path: '/api/chat/{id}',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        var chats;
        DAL.chat.getByConversationId(request.params.id).then( res => {
          // TODO: 'res' is not a chats it is a messeges
          chats = res;
          var promises = [];

          chats.map(function(chat) {
            promises.push( DAL.users.getUserById(chat.authorId) );
          });

          return Promise.all(promises);
        }).then(res => {

          for (var i = 0; i < chats.length; i++) {
            // TODO: we do not need thoto for all messages
            chats[i].photo = res[i].photo ? res[i].photo.toString() : null;
          }

          reply(chats);
        }).catch( err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });

  /**
   * @api {get} /api/chat-for-dashboard Request chat for dashboard
   * @apiName GetChatForDashboard
   * @apiGroup Chat
   *
   *
   * @apiSuccess {Object[]} chat                          List of chat messages.
   * @apiSuccess {String}   chat.id                       Chat id.
   * @apiSuccess {String}   chat.authorId                 Author id.
   * @apiSuccess {String}   chat.conversationId           Conversation Id.
   * @apiSuccess {String}   chat.date                     Date.
   * @apiSuccess {String}   chat.message                  Message.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {[
   *   id: 1,
   *   authorId: 4,
   *   conversationId: 20,
   *   date: '0000-00-00 00:00:00',
   *   message: 'text'
   * ]}
   */
  server.route({
    method: 'GET',
    path: '/api/chat-for-dashboard',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        let author = request.auth.credentials;
        let conversationsArr = [];

        DAL.conversations.getByAuthor(author.id).then(res => {
          let promises = [];

          res.map( conversation => {
            conversationsArr.push(conversation.id);
          });

          conversationsArr.map( id => {
            promises.push(DAL.chat.getByConversationId(id));
          });

          return Promise.all(promises);
        }).then(res => {
          let chats = [];
          res.map( chat => {
            for (let i = 0; i < chat.length; i++) {
              if (chat[i].authorId !== author.id) {
                chats.push(chat[i]);
              }
            }
          });
          reply(chats);
        }, err => {
          reply(Boom.badImplementation(err, err));
        });
      }
    }
  });
};
