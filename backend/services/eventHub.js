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
    const publishConfig = {
      channel,
      message,
    };

    return new Promise((resolve, reject) => {
      return pubnub.publish(publishConfig, function(status, response) {
        if (!status.error) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};
