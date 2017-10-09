'use strict';
const uuid = require('node-uuid');

const config = require('../config');

const separator = '_';

function removeForbidenSymbols(str) {
  const forbidenSymbolsRegExp = /[%\^!*'();:@&=+$,\/?#\[\]~><\s`\\|_]/g;

  return str.replace(forbidenSymbolsRegExp, '');
}

module.exports = function(DAL){
  return {
    addVideo: (fileBuffer, name, authorId, authorName, mimetype) => {
      const fileStorage = require('../services/fileStorage.js');

      const id = uuid.v1();
      const newName = id + separator + removeForbidenSymbols(name);

      return fileStorage.upload({
        name: newName,
        mimetype,
        buffer: fileBuffer,
        bucketName: config.google.storageVideoBucketName,
      }).then(() => {
        return DAL.videos.add(name, authorId, newName, newName);
      });
    },

    addFile: (fileBuffer, name, authorId, authorName, mimetype) => {
      const fileStorage = require('../services/fileStorage.js');
      const id = uuid.v1();
      const newName = id + separator + removeForbidenSymbols(name);

      return fileStorage.upload({
        name: newName,
        mimetype,
        buffer: fileBuffer,
        bucketName: config.google.storageFilesBucketName,
      }).then(() => {
        return DAL.files.add(name, authorId, newName, newName);
      });
    },

    getVideoUrl: (id) => {
      const fileStorage = require('../services/fileStorage.js');

      return DAL.videos.get(id).then(function (res) {
        return fileStorage.getPublicUrl(
          config.google.storageVideoBucketName,
          res.external_file_id
        );
      });
    },

    getFile: (id) => {
      const fileStorage = require('../services/fileStorage.js');

      return DAL.files.getById(id).then(function (res) {
        return fileStorage.getPublicUrl(
          config.google.storageFilesBucketName,
          res.external_file_id
        );
      });
    },
  };
};
