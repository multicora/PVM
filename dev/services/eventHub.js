(function(angular) {
  'use strict';
  var app = angular.module('app');

  app.service('eventHub', service);

  service.$inject = [];
  function service() {
    var listeners = {};
    var pubnub = new PubNub({
      // publishKey : 'demo',
      subscribeKey: 'sub-c-ffcba3d4-9f0b-11e7-8e6b-ae1a713ba7dc',
    });

    pubnub.addListener({
      // status: function(statusEvent) {
      //   if (statusEvent.category === "PNConnectedCategory") {
      //     publishSampleMessage();
      //   }
      // },
      message: function(res) {
        var channelListeners = listeners[res.channel];
        if (channelListeners) {
          channelListeners.forEach(function (cb) {
            cb(res.message);
          });
        }
      },
      presence: function(/* presenceEvent */) {
        // TODO: handle presence
      }
    });

    this.sub = function (channel, cb) {
      pubnub.subscribe({
        channels: [channel]
      });

      listeners[channel] = listeners[channel] || [];
      listeners[channel].push(cb);
    };
  }
})(angular);
