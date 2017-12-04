'use strict';

const RandToken = require('rand-token');

const config = require('./config.js');

module.exports = {
  newToken: function() {
    const charLength = 16;
    return RandToken.generate(charLength);
  },

  getServerUrl: function (request) {
    const server = request.server;
    const protocol = config.forseHttpsForTheMail ? 'https' : server.info.protocol;
    const serverUrl = protocol + '://' + request.info.host;

    return serverUrl;
  },
};
