'use strict';

const fs = require('fs');
const Promise = require('promise');
const BoxSDK = require('box-node-sdk');

module.exports = function (config) {
  const sslFilename = config.sslFilename;
  const clientID = config.clientID;
  const clientSecret = config.clientSecret;
  const authKeyID = config.authKeyID;
  const authPassphrase = config.authPassphrase;
  const enterpriseId = config.enterpriseId;

  return new Promise(function (resolve, reject) {

    fs.readFile(sslFilename, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        const privatKey = data;

        const sdk = new BoxSDK({
          clientID: clientID,
          clientSecret: clientSecret,
          appAuth: {
            keyID: authKeyID,
            privateKey: privatKey,
            passphrase: authPassphrase
          }
        });

        const box = sdk.getAppAuthClient('enterprise', enterpriseId);

        resolve({
          upload: function (fileName, data) {
            return new Promise(function (resolve, reject) {
              box.files.uploadFile('0', fileName, data, function(err, res) {
                err ? reject(err) : resolve(res.entries[0]);
              });
            });
          },
          download: function (id) {
            return new Promise(function (resolve, reject) {
              box.files.getReadStream(id, null, function(err, file) {
                err ? reject(err) : resolve(file);
              });
            });
          },
          getThumbnail: function (id) {
            return new Promise(function (resolve, reject) {
              box.files.getThumbnail(id, null, function(err, thumbnail) {
                err ? reject(err) : resolve(thumbnail);
              });
            });
          }
        });
      }
    });

  });
};