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
          // TODO: redirect to main page
          this.send('anotherAction');
        },
        () => {
          this.set('errorMessage', 'login or password incorrect');
        }
      );
    },
    anotherAction() {
      let result = this.get('redirect');

      console.log(result); // 42
    }
  }
});
