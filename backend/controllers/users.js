'use strict';

const Promise = require('promise');
const passwordHash = require('password-hash');
const utils = require('../utils.js');
const Boom = require('boom');

module.exports = function (DAL) {
  return {
    verifyPassword: (user, passwordForVerify) => {
      if (!!user.password && passwordHash.verify(user.password, passwordForVerify)) {
        return true
      } else {
        return false
      }
    }
  };
}