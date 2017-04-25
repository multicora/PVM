'use strict';
// const config = require('../config.js');

module.exports = function (DAL) {
  return {
    sendChatToDb: (data) => {
      return DAL.chat.add(data);
    }
  };
};
