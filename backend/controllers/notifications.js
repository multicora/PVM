'use strict';
const mailer = require('../services/mailer.js');
const config = require('../config.js');
const templates = require('../services/templates.js')();

module.exports = function (DAL) {

  return {
    conversationOpened: (conversation, link) => {
      let user;
      return DAL.users.getUserById(conversation.author).then(res => {
        user = res;
        user.firstName = user.firstName || '';

        return templates.conversationOpened(link, user.firstName, 'Person with email: ' + conversation.email);
      }).then(template => {
        const message = 'Your conversation was viewed!';

        const mail = {
          to: user.email,
          subject: 'Notification from conversation',
          text: message,
          html: template.html
        };

        return mailer(config).send(mail);
      });
    },

    videoWatched: (conversation, link) => {
      let user;
      return DAL.users.getUserById(conversation.author).then((res) => {
        user = res;
        user.firstName = user.firstName || '';

        return templates.videoWatched(link, user.firstName,
          ('Person with email: ' + conversation.email) || '');
      }).then((res) => {
        const mail = {
          to: user.email,
          subject: 'Notification from conversation',
          text: res.text,
          html: res.html
        };

        return mailer(config).send(mail);
      });
    },

    fileDownloaded: (conversation, link) => {
      let user;
      return DAL.users.getUserById(conversation.author).then((res) => {
        user = res;
        user.firstName = user.firstName || '';

        return templates.fileDownloaded(link, user.firstName,
          ('Person with email: ' + conversation.email) || '');
      }).then((res) => {
        const mail = {
          to: user.email,
          subject: 'Notification from conversation',
          text: res.text,
          html: res.html
        };

        return mailer(config).send(mail);
      });
    }
  };
};
