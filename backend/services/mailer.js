'use strict';

const nodemailer = require('nodemailer');
const Promise = require('promise');
// const xoauth2 = require('xoauth2');

module.exports = function (config) {
  // generator.on('token', function(token){
  //   console.log('New token for %s: %s', token.user, token.accessToken);
  // });
  // create reusable transporter object using the default SMTP transport 
  var transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true, // use SSL
    auth: {
      user: config.user,
      pass: config.pass
    }
      // var transporter = nodemailer.createTransport("SMTP",{
      //   service:"Gmail",
      //   xoauth2: xoauth2.createXOAuth2Generator({
      //   user: config.user,
      //   clientId: config.clientId,
      //   clientSecret: config.clientSecret,
      //   refreshToken: config.refreshToken
      // })
  });

  return {
    send: function (mail) {
      return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transporter.sendMail(mail, function(error, info){
          if (error) {
            reject(error);
          } else {
            resolve('Message sent: ' + info.response);
          }
        });
      });
    }
  };
};
