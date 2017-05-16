'use strict';

module.exports = () => {
  const Promise = require('promise');

  let EmailTemplate = require('email-templates').EmailTemplate;
  let templatesDir = './emailTemplates';

  return {
    videoWatched: (url, email) => {
      return new Promise( (resolve, reject) => {
        const path = require('path');
        let newUserTemplateDir = '/action';
        let templateDir = path.join(__dirname, templatesDir, newUserTemplateDir);
        let letter = new EmailTemplate(templateDir);
        let props = {
          title: 'Your conversation video has been watched.',
          line1: 'Person with email: ' + email + ' watched video in your conversation.',
          line2: '',
          buttonText: 'Go to conversation',
          buttonLink: url
        };
        letter.render(props, function (err, result) {
          err ? reject(err) : resolve(result);
        });
      });
    }
  };
};
