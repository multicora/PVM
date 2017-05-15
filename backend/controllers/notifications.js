'use strict';
const mailer = require('../services/mailer.js');
const config = require('../config.js');
const template = require('../services/mailTemplate.js');

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
          html: template.templateForOpenedConversation(link, user.firstName, 'Person with email: ' + conversation.email)
        };

        return mailer(config).send(mail);
      });
    },

    videoWatched: (conversation, link) => {
      return DAL.users.getUserById(conversation.author).then((user) => {
        user.firstName = user.firstName || '';
        const message = 'Your conversation video has been watched!';

        const mail = {
          to: user.email,
          subject: 'Notification from conversation',
          text: message,
          html: '<div style="white-space: pre;">' + 'Person with email: ' + conversation.email +
            'watched videou in your conversation!' + link + '</div>'
        };

        return mailer(config).send(mail);
      });
    }
  };
};
