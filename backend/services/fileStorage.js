'use strict';

const storageConstructor = require('@google-cloud/storage');
const Promise = require('promise');

const config = require('../config');

// Instantiates a client
const storage = storageConstructor({
  // Your Google Cloud Platform project ID
  projectId: config.google.projectId,
});

// // The name for the new bucket
// const bucketName = config.google.storageBucketName;

function getPublicUrl(bucketName, filename) {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

function sendUploadToGCS ({ name, mimetype, buffer, bucketName }) {
  return new Promise((resolve, reject) => {
    // const originalName = req.file.originalname;
    // const mimetype = req.file.mimetype;
    // const buffer = req.file.buffer;

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(name);
    // const gcsname = Date.now() + originalName;
    const stream = file.createWriteStream({
      metadata: {
        contentType: mimetype,
      }
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', () => {
      file.makePublic().then(() => {
        resolve({
          // originalName,
          // name,
          publicUrl: getPublicUrl(bucketName, name),
        });
      });
    });

    stream.end(buffer);
  });
}

module.exports = {
  upload: sendUploadToGCS,
  getPublicUrl: getPublicUrl,
};
