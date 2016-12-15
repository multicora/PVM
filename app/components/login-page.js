import Ember from 'ember';

const { Component } = Ember;

export default Ember.Component.extend({
  // errorMessage: 'password is wrong!',
  session: Ember.inject.service(),
  disabledButton: false,
  actions: {
    authenticate: function() {
      var credentials = this.getProperties('identification', 'password'),
        authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then(
        () => {
          this.get('success')();
        },
        () => {
          this.set('errorMessage', 'login or password incorrect');
        }
      );
    }
  }
});
