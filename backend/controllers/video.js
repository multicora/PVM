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
          function () {
            return DAL.videos.addVideo(name, newName);
          }
        );
      });
    }
  };
};