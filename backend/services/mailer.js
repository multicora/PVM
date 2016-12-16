const nodemailer = require('nodemailer');
const Promise = require('promise');

module.exports = function (config) {
  // create reusable transporter object using the default SMTP transport 
  var transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true, // use SSL
    auth: {
      user: config.user,
      pass: config.pass
    }
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
