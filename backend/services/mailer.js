'use strict';

module.exports = function (config) {
  const Promise = require('promise');

  const logger = require('./logger.js');

  const apiKey = config.mailGun.apiKey;
  const domain = config.mailGun.domain;
  const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});


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
        const defaultHtml = [
          '<div style="white-space: pre;">',
            mail.text || '',
          '</div>'
        ].join('');

        const data = {
          from: mail.from || config.mail.defaultFrom,
          to: mail.to,
          subject: mail.subject || config.mail.defaultSubject,
          text: mail.text || '',
          html: mail.html || defaultHtml
        };

        if (!config.debugMode) {
          mailgun.messages().send(data, function (error, body) {
            error ? reject(error) : resolve(body);
          });
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
