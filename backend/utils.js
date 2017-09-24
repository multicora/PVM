'use strict';

const RandToken = require('rand-token');

module.exports = {
  newToken: function() {
    return RandToken.generate(16);
  },

  getServerUrl: function (request) {
    let server = request.server;
    let serverUrl = server.info.protocol + '://' + request.info.host;

    return serverUrl;
  },
};
