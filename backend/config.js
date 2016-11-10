const DB = {
  TYPES: {
    MONGO: 'MONGO',
    MySQL: 'MySQL'
  }
}

module.exports = {
  db: {
    type: DB.TYPES.MySQL,
    dbName: 'pvmDB',
    host: 'localhost',
    user: 'root',
    password: ''
  },
  server: {
    port: 8081
  },
  box: {
    clientID: 'nkf2rekn1n46ix1b212mimin1euge25k',
    clientSecret: 'OxufO25Lvw0hpAclvzoN4xClatYoCStF',
    devToken: 'KGNBWoIOocO1GY9PY5SUMTSkDepl088L',
    passphrase: 'bizkonect',
    publicKeyId: 'm4g8g81p',
    privateKey: 'm4g8g81p',
    enterpriseID: '5924343'
  }
  google: {
    APIkey: 'AIzaSyBrdvFI8tYGlK1nkjUTWkF6BLUPvm7i4IY' 
  }
}