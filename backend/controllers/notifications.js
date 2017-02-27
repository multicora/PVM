'use strict';
const mailer = require('../services/mailer.js');
const config = require('../config.js');

module.exports = function (DAL) {
  return {
    conversationOpened: (conversation) => {
      return DAL.users.getUserById(conversation.author).then((user) => {
        const message = 'Your conversation was viewed!';

        const mail = {
          to: user.email,
          subject: 'Notification from conversation',
          text: message
        };

        return mailer(config).send(mail);
      });
    }
  };
};
