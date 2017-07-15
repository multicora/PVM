'use strict';

module.exports = function (config) {
  const Promise = require('promise');
  const SparkPost = require('sparkpost');

  const logger = require('./logger.js');

  const apiKey = config.mail.apiKey;

  return {
    /**
     * Send mail.
     * @param {Object} mail - Mail config.
     * @param {string} [mail.from] - The sender (e.g. '<email@email.com>', 'Excited User <email@email.com>').
     * @param {string} mail.to - Email address of the recipient(s). Example: "Bob <bob@host.com>". You can use commas to separate multiple recipients.
     * @param {string} [mail.subject] - Message subject.
     * @param {string} [mail.text] - Body of the message. (text version).
     * @param {string} [mail.html] - Body of the message. (HTML version).
     */
    send: (mail) => {
      return new Promise((resolve, reject) => {
        const sparky = new SparkPost(apiKey);

        const defaultHtml = [
          '<div style="white-space: pre;">',
            mail.text || '',
          '</div>'
        ].join('');

        if (!config.debugMode) {
          sparky.transmissions.send({
            content: {
              from: mail.from || config.mail.defaultFrom,
              subject: mail.subject || config.mail.defaultSubject,
              html: mail.html || defaultHtml
            },
            recipients: [
              { address: mail.to }
            ]
          })
          .then(resolve, reject);
        } else {
          logger.print('========== Mailer stub ==========');
          logger.print(`New message for ${mail.to}`);
          logger.print(`${mail.text}`);
          logger.print('========== Mailer stub end ==========');
          resolve();
        }
      });
    }
  };
};
