'use strict';

module.exports = function(DAL) {
  return {
    version: 47,
    message: 'Moving to backblaze',
    script: function (next) {
      DAL.chat.getAllStatus().then(res => {
        let promises = [];
        res.map(status => {
          promises.push(DAL.chat.deleteStatus(status.id));
        });

        return Promise.all(promises);
      }).then(() => {
        return DAL.chat.getAll();
      }).then(res => {
        let promises = [];
        res.map(chat => {
          promises.push(DAL.chat.delete(chat.id));
        });

        return Promise.all(promises);
      }).then(() => {
        return DAL.conversations.getAll();
      }).then((res) => {
        let promises = [];
        res.map(conversation => {
          promises.push(DAL.conversations.delete(conversation.id));
        });

        return Promise.all(promises);
      }).then(() => {
        return DAL.videos.getAll();
      }).then((res) => {
        let promises = [];

        res.map(video => {
          promises.push(DAL.videos.delete(video.v_id));
        });

        return Promise.all(promises);
      }).then(() => {
        next();
      });
    }
  };
};
