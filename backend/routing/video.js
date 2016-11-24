'use strict';

let files = require('../services/files.js')();

module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/video',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },

      // state: {
      //   parse: true,
      //   failAction: 'log'
      // },
      handler:  function (request, reply) {
        files.saveFile(request, reply);
      }
    }
  });

};