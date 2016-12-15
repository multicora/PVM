import BaseAuthorizer from 'ember-simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize(data, block) {
    console.log(data);
    const { token }  = data;
    if (token) {
      block('Authorization', `${token}`);
    }
  }
});