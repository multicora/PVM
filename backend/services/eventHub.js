'use strict';

const PubNub = require('pubnub');
const Promise = require('promise');

const config = require('../config.js');

const pubnub = new PubNub({
  publishKey: config.pubnub.publishKey,
  subscribeKey: config.pubnub.subscribeKey,
});

module.exports = {
  pub(channel, message) {
    console.log(channel, message);
    const publishConfig = {
      channel,
      message,
    };

    return new Promise((resolve, reject) => {
      return pubnub.publish(publishConfig, function(status, response) {
        console.log(status);
        if (!status.error) {
          console.log(response);
          resolve(response);
        } else {
          console.log(response);
          reject(response);
        }
      });
    });
  }
};
