'use strict';

module.exports = function(DAL) {
  return {
    version: 61,
    message: 'Add table "events" to db',
    script: function (next) {
      DAL.events.createTable(next);
    }
  };
};
