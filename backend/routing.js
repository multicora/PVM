'use strict';

const path = require('path');

module.exports.init = function (server) {

  server.route({
    method: 'GET',
    path: '/{param*}',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      handler:  function (request, reply) {
        reply.file( path.resolve(__dirname, './public/' + (request.params.param || 'index.html') ) );
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/upload_video',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      handler:  function (request, reply) {
        console.log('send');
      }
    }
  });
};