'use strict';
const mailer = require('../services/mailer.js');
const config = require('../config.js');
const mailTemplate = require('../services/mailTemplate.js'); // shoud be remove to template
const template = require('../services/templates.js')();

module.exports = function (DAL) {

  return {
    conversationOpened: (conversation, link) => {
      return DAL.users.getUserById(conversation.author).then((user) => {
        user.firstName = user.firstName || '';
        const message = 'Your conversation was viewed!';

        const mail = {
          to: user.email,
          subject: 'Notification from conversation',
          text: message,
          html: mailTemplate.templateForOpenedConversation(link, user.firstName, 'Person with email: ' + conversation.email)
        };

        return mailer(config).send(mail);
      });
    },

    videoWatched: (conversation, link) => {
      let user;
      return DAL.users.getUserById(conversation.author).then((res) => {
        user = res;
        user.firstName = user.firstName || '';

        return template.videoWatched(link, conversation.email || '');
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
