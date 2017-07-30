'use strict';

const merge = require('merge');
const isCI = require('is-ci');

const logger = require('./services/logger.js');

var userConfig;

try {
  userConfig = require('./userConfig.js');
} catch (ex) {
  userConfig = {};
}

const DB = {
  TYPES: {
    MONGO: 'MONGO',
    MySQL: 'MySQL'
  }
};

let config = {
  debugMode: false,
  db: {
    type: DB.TYPES.MySQL,
    dbName: 'pvmdb',
    host: 'localhost',
    user: 'root',
    password: ''
  },
  server: {
    port: 443
  },
  box: {
    sslFilename: './private_key.pem',
    clientID: 'nkf2rekn1n46ix1b212mimin1euge25k',
    clientSecret: 'OxufO25Lvw0hpAclvzoN4xClatYoCStF',
    authKeyID: 'f00trodl',
    authPassphrase: 'bizkonect',
    enterpriseId: '5924343'
  },
  google: {
    APIkey: ''
  },
  mail: {
    defaultSubject: 'Bizkonect',
    defaultFrom: 'Bizkonect <No-reply@bizkonect.com>',
    apiKey: ''
  },
  notification: {
    time: 5 // Should be in minutes
  },
  storage: {
    accountId: '',
    applicationKey: '',
    videoBucketId: '',
    fileBucketId: ''
  },
  suport: {
    email: ''
  },
  logging: {
    key: ''
  }
};

const fullConfig = merge.recursive(config, userConfig);

if (!isCI) {
  validate(fullConfig);
} else {
  logger.print('The code is running on a CI server. Skip config valiation');
}

function validate(conf) {
  if (!conf.debugMode) {
    validateProperty(conf.mail.apiKey, '"config.mail.apiKey" key should be exist and not empty');
  }
  validateProperty(conf.mail.defaultFrom, '"config.mail.defaultFrom" key should be exist and not empty');
}

function showError(msg) {
  throw new Error(msg);
}

function validateProperty(property, message) {
  if (!property) {
    showError(message);
  }
}

module.exports = fullConfig;
