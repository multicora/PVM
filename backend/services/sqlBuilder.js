'use strict';

const squel = require("squel");

squel.registerValueHandler('undefined', function(x) {
  return null;
});

module.exports = squel;
