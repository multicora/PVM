'use strict';

const B2 = require('backblaze-b2');
const config = require('../config.js');

module.exports = function () {
  // create b2 object instance
  const b2 = new B2({
    accountId: config.storage.accountId,
    applicationKey: config.storage.applicationKey
  });

  return b2.authorize().then( () => {
    return {
      addFile: (fileBuffer, name, authorId, authorName) => {
        // get upload url
        return b2.getUploadUrl(config.storage.bucketId).then( res => {
          // upload file
          return b2.uploadFile({
            uploadUrl: res.data.uploadUrl,
            uploadAuthToken: res.data.authorizationToken,
            filename: name,
            data: fileBuffer, // this is expecting a Buffer not an encoded string,
            info: {
              // optional info headers, prepended with X-Bz-Info- when sent, throws error if more than 10 keys set
              // valid characters should be a-z, A-Z and '-', all other characters will cause an error to be thrown
              authorId: authorId,
              authorName: authorName
            }
            // onUploadProgress: function(event) || null // progress monitoring
          });  // returns promise
        });
      },

      getFile: (id) => {
        return b2.getFileInfo(id);
      },
    };
  });
};
