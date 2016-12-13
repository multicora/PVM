'use strict';

const RandToken = require('rand-token');

module.exports = {
  newToken: function() {
    return RandToken.generate(16);
  }
}