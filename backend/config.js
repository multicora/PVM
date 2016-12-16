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
}

var config = {
  db: {
    type: DB.TYPES.MySQL,
    dbName: 'pvmdb',
    host: 'localhost',
    user: 'root',
    password: ''
  },
  server: {
    port: 8081
  },
  box: {
    sslFilename: '../private_key.pem',
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
  }
};

module.exports = merge(config, userConfig);