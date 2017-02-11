'use strict';

module.exports = function(DAL) {
  return {
    version: 24,
    message: 'Add author to all videos',
    script: function (next) {
      let userId;

      DAL.users.getAllUsers().then((users) => {
        userId = users[0].id;
      }).then(() => {
        return DAL.videos.getAll();
      }).then((videos) => {
        let promises = videos.map((video) => {
          return DAL.videos.setAuthor(video.v_id, userId);
        });

        return Promise.all(promises);
      }).then(() => {
        next();
      }).catch((err) => {
        next(err);
      });
    }
  }
};