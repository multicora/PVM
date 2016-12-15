import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize(data, block) {
    const { token }  = data;
    if (token) {
      block('Authorization', `x-biz-token ${token}`);
    }
  }
});