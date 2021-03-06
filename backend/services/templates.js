'use strict';

module.exports = () => {
  const Promise = require('promise');

  let EmailTemplate = require('email-templates').EmailTemplate;
  let templatesDir = './emailTemplates';

  return {
    videoWatched: (link, authorName, userName) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let videoWatchedTemplateDir = '/conversationNotification';
        let templateDir = path.join(__dirname, templatesDir, videoWatchedTemplateDir);
        let letter = new EmailTemplate(templateDir);

        authorName = authorName ? authorName + ',' : '';
        let props = {
          text: authorName + userName + 'just watched your conversation video',
          link: link
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    videoIsWatching: (link, authorName, userName) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let videoIsWatchingTemplateDir = '/conversationNotification';
        let templateDir = path.join(__dirname, templatesDir, videoIsWatchingTemplateDir);
        let letter = new EmailTemplate(templateDir);

        authorName = authorName ? authorName + ',' : '';
        let props = {
          text: authorName + userName + ' is watching your conversation video now',
          link: link
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    fileDownloaded: (link, authorName, userName) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let fileDownloadedTemplateDir = '/conversationNotification';
        let templateDir = path.join(__dirname, templatesDir, fileDownloadedTemplateDir);
        let letter = new EmailTemplate(templateDir);

        authorName = authorName ? authorName + ',' : '';
        let props = {
          text: authorName + userName + 'just downloaded your conversation file',
          link: link
        };

        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    conversationOpened: (link, authorName, userName) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let conversationOpendTemplateDir = '/conversationNotification';
        let templateDir = path.join(__dirname, templatesDir, conversationOpendTemplateDir);
        let letter = new EmailTemplate(templateDir);

        authorName = authorName ? authorName + ', ' : '';
        let props = {
          text: authorName + userName + ' just viewed your conversation',
          link: link
        };

        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    feedbackIncome: (email, message, date) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let conversationOpendTemplateDir = '/feedback';
        let templateDir = path.join(__dirname, templatesDir, conversationOpendTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          email: email,
          message: message,
          date: date
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    newMessage: (link, authorName, userName) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let conversationOpendTemplateDir = '/conversationNotification';
        let templateDir = path.join(__dirname, templatesDir, conversationOpendTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          text: authorName + 'You have new message from' + userName,
          link: link
        };

        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    sendConversation: (url, authorName, title, message) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let sendConversationTemplateDir = '/conversation';
        let templateDir = path.join(__dirname, templatesDir, sendConversationTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          title: title,
          authorName: authorName,
          message: message,
          buttonLink: url
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    resetPassword: (link) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let resetPasswordTemplateDir = '/resetPassword';
        let templateDir = path.join(__dirname, templatesDir, resetPasswordTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          link: link
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    invite: (link, user) => {
      user = user || 'friend';

      return new Promise( (resolve, reject) => {
        const path = require('path');
        let inviteTemplateDir = '/invite';
        let templateDir = path.join(__dirname, templatesDir, inviteTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          link: link,
          user: user
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    },

    registration: (link) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let registerTemplateDir = '/registration';
        let templateDir = path.join(__dirname, templatesDir, registerTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          link: link
        };

        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    }
  };
};
