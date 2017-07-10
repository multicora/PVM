'use strict';
const TYPES = {
  error: 'error',
  log: 'log'
};
module.exports = {
  print(msg, type) {
    type = TYPES[type] || TYPES.log;

    console[type](msg);
  }
};
