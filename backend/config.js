'use strict';

var merge = require('merge');

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

var config = {
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
    host: 'smtp.gmail.com',
    port: 465,
    user: '',
    pass: '',
    defaultSubject: 'BizKonect',
    defaultFrom: 'No reply <No-reply@bizkonect.com>'
  },
  mailGun: {
    apiKey: '',
    domain: ''
  }
};

module.exports = merge(config, userConfig);
