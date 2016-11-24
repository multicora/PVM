// TODO: check max size
// TODO: check extension

'use strict';

const fs = require('fs');
const glob = require('glob');
const uuid = require('node-uuid');
const Promise = require('promise');

module.exports = function (config) {
  config = config || {};

  const folder = config.folder || 'uploads';
  const separator = '_';

  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  return {
    saveFile: (request, cb) => {
      const data = request.payload;

      if (data.file) {
        console.log(data);
        const name = data.file.hapi.filename;
        const id = uuid.v1();
        const path = folder + '/' + id + separator + name;
        const file = fs.createWriteStream(path);

        file.on('error', function (err) {
          cb(err);
        });

        data.file.pipe(file);

        data.file.on('end', function (err) {
          cb(null, id);
        })
      }
    },
    getFile: (id, cb) => {
      return new Promise(function (resolve, reject) {
        const path = folder + '/' + id + separator;

        glob(path + '*', {nonull:true}, function (err, files) {
          err ? reject(err) : resolve(files[0]);
          cb && cb(err, files);
        });
      });
    },
    removeFile: (id, cb) => {
      return new Promise(function (resolve, reject) {
        const path = folder + '/' + id + separator;

        glob(path + '*', {nonull:true}, function (err, files) {
          if (!err) {
            const filesPromises = files.map(function (file) {
              return new Promise(function (resolve, reject) {
                fs.unlink(file, resolve);
              });
            });

            Promise.all(filesPromises).then(function (res) {
              resolve();
              cb && cb(null);
            });
          } else {
            reject(err);
            cb && cb(err);
          }
        });
      });
    }
  }
}