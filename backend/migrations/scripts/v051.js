'use strict';

module.exports = function(DAL) {
  return {
    version: 51,
    message: 'Add "feedbacks" table',
    script: function (next) {
      DAL.feedbacks.createTable(next);
    }
  };
};
