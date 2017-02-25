'use strict';

module.exports = function (config) {
  let apiKey = config.mailGun.apiKey;
  let domain = config.mailGun.domain;
  let mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

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
        let defaultHtml = [
          '<div style="white-space: pre;">',
            mail.text || '',
          '</div>'
        ].join('');

        let data = {
          from: mail.from || config.mail.defaultFrom,
          to: mail.to,
          subject: mail.subject || config.mail.defaultSubject,
          text: mail.text || '',
          html: mail.html || defaultHtml
        };

        mailgun.messages().send(data, function (error, body) {
          error ? reject(error) : resolve(body);
        });
      });
    }
  };

};
