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

        console.log('Start uploading to Box.com');
        return box.upload(newName, buffer).then(
          function (fileInfo) {
            console.log('Finish uploading to Box.com');
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
    },
    getAllvideos: () => {
      let boxActions;
      let videosArr;
      return Box(config.box).then(function(box) {
        boxActions = box;
        return DAL.videos.getAllVideos();
      })
      .then(function(videos) {
        videosArr = videos;
        return Promise.all(
          videos.map(function(video) {
            return boxActions.getThumbnail(video.external_file_id);
          })
        )
      })
      .then(function(response) {
        for (let i = 0; i < videosArr.length; i++) {
          console.log(response[i].file);
          console.log("-------------------------------------------------------");
          // console.log(response[i].file.toString('utf8', 0, 3));
          videosArr[i].thumbnail = response[i].file;
        }
        return videosArr;
      });
    }
  };
};