'use strict';

module.exports = function () {
  var obj = {
    events: {},
    on: (eventName, fn) => {
      obj.events[eventName] = obj.events[eventName] || [];
      obj.events[eventName].push(fn);
    },
    off: (eventName, fn) => {
      if (obj.events[eventName]) {
        for (var i = 0; i < this.events[eventName].length; i++) {
          if (obj.events[eventName][i] === fn) {
            obj.events[eventName].splice(i, 1);
            break;
          }
        };
      }
    },
    emit: (eventName, data) => {
      if (obj.events[eventName]) {
        obj.events[eventName].forEach(function (fn) {
          fn(data);
        });
      }

      return data;
    }
  };

  return obj;
};
