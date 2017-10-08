'use strict';

const RandToken = require('rand-token');

const config = require('./config.js');

module.exports = {
  newToken: function() {
    return RandToken.generate(16);
  },

  getServerUrl: function (request) {
    const server = request.server;
    const protocol = config.forseHttpsForTheMail ? 'https' : server.info.protocol;
    const serverUrl = protocol + '://' + request.info.host;

    return serverUrl;
  },
};
