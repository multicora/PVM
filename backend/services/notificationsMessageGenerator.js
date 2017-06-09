'use strict';

module.exports = () => {

  return {
    fileIsDownloaded: function (email) {
      return 'files in conversation with ' + email + ' were downloaded';
    },
    videoIsWatched: function (email) {
      return 'video in conversation with ' + email + ' is watched';
    },
    videoIsWatching: function (email) {
      return 'video in conversation with ' + email + ' is watching';
    },
    conversationIsOpened: function (email) {
      return 'conversation with ' + email + ' is opened';
    },
    newMessage: function (email) {
      return 'you have new message in conversation with ' + email;
    },
  };
};
