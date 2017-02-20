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
    APIkey: 'AIzaSyBrdvFI8tYGlK1nkjUTWkF6BLUPvm7i4IY' 
  },
  mail: {
    host: 'smtp.gmail.com',
    port: 465,
    user: 'bizkonect.project@gmail.com',
    pass: '2903tujaglvs;kcM'
    // clientId:"bizkonect-150216@appspot.gserviceaccount.com",    //for Authx0.2
    // clientSecret:"2eed29a8eaccbe841e384ee3e4b7a081c598c312",
    // refreshToken:"1/X_8O--i8CLIiFB5jwVV7twvdnZPRbMkazd5ZCiGV4Ic"
  },
  mailConfig: {
    link: 'https://159.203.232.30:80/conversation/',
    linkForNewPassword: 'https://159.203.232.30:80/new-password/'
  }
};

module.exports = merge(config, userConfig);