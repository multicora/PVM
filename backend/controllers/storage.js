'use strict';
const uuid = require('node-uuid');
const separator = '_';

module.exports = function(DAL){
  const b2 = require('../services/backblaze.js');

  return {
    addVideo: (fileBuffer, name, authorId, authorName, thumbnail) => {
      return b2().then( storage => {
        const id = uuid.v1();
        const newName = id + separator + name;

        console.log('Start uploading to storage');
        return storage.addVideo(fileBuffer, newName, authorId, authorName).then((fileInfo) => {
          console.log('Finish uploading');
          return DAL.videos.add(name, authorId, newName, fileInfo.data.fileId, thumbnail);
        });
      });
    },

    addFile: (fileBuffer, name, authorId, authorName) => {
      return b2().then( storage => {
        const id = uuid.v1();
        const newName = id + separator + name;

        console.log('Start uploading to storage');
        return storage.addFile(fileBuffer, newName, authorId, authorName).then((fileInfo) => {
          console.log('Finish uploading');
          return DAL.files.add(name, authorId, newName, fileInfo.data.fileId, fileInfo.data.contentLength);
        });
      });
    },

    getVideo: (id) => {
      return b2().then( storage => {
        return DAL.videos.get(id).then(function (res) {
          return storage.getDownloadUrl(res.external_file_id);
        });
      });
    },

    getFile: (id) => {
      return b2().then( storage => {
        return DAL.files.getById(id).then(function (res) {
          return storage.getDownloadUrl(res.external_file_id);
        });
      });
    },
  };
};
