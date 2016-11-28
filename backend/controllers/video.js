const uuid = require('node-uuid');
const config = require('../config.js');
const Box = require('../services/box.js');

const separator = '_';

module.exports = function (DAL) {
  return {
    saveFile: (name, buffer) => {
      return Box(config.box).then(function (box) {
        const id = uuid.v1();
        const newName = id + separator + name;

        return box.upload(newName, buffer).then(
          function (fileInfo) {
            return DAL.videos.add(name, newName, fileInfo.id);
          }
        );
      });
    },
    getFile: (id) => {
      return Box(config.box).then(function (box) {
        return DAL.videos.get(id).then(function (res) {
          return box.download(res.external_file_id);
        });
      });
    }
  };
};