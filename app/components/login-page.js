import Ember from 'ember';

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
        },
        () => {
          // TODO: show error message
        }
      );
    }
  }
});
