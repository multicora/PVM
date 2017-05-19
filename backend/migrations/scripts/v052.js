'use strict';

module.exports = function(DAL) {
  return {
    version: 52,
    message: 'Add "files" table',
    script: function (next) {
      DAL.files.createTable(next);
    }
  };
};
