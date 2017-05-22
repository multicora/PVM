'use strict';

const squel = require('squel');

squel.registerValueHandler('undefined', function() {
  return null;
});

module.exports = squel;
