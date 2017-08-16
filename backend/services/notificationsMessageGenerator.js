'use strict';

module.exports = () => {

  return {
    fileIsDownloaded: function () {
      return 'FILE_IS_DOWNLOADED';
    },
    videoIsWatched: function () {
      return 'VIDEO_IS_WATCHED';
    },
    videoIsWatching: function () {
      return 'VIDEO_IS_WATCHING';
    },
    conversationIsOpened: function () {
      return 'CONVERSATION_IS_VIEWED';
    },
    newMessage: function () {
      return 'NEW_MESSAGE';
    },
  };
};
