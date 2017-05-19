'use strict';

const path = require('path');
const fs = require('fs');

module.exports.init = function (server, DAL) {
  server.route({
    method: 'GET',
    path: '/{param*}',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      handler: function (request, reply) {
        let fileName = path.resolve(__dirname, './public/' + request.params.param);
        let indexPath = path.resolve(__dirname, './public/index.html');

        fs.stat(fileName, function(err) {
          let hasExt = path.extname(fileName) !== '';

          if (!err && hasExt) {
            reply.file(fileName);
          } else {
            reply.file(indexPath);
          }
        });
      }
    }
  });

  require('./routing/video.js')(server, DAL);
  require('./routing/users.js')(server, DAL);
  require('./routing/roles.js')(server, DAL);
  require('./routing/conversations.js')(server, DAL);
  require('./routing/socket.js')(server, DAL);
  require('./routing/feedbacks.js')(server, DAL);
};
