import Ember from 'ember';

export default Ember.Component.extend({
  // errorMessage: 'password is wrong!',
  session: Ember.inject.service(),
  actions: {
    authenticate: function() {
      var credentials = this.getProperties('identification', 'password'),
        authenticator = 'authenticator:token';
      console.log(credentials);

      this.get('session').authenticate(authenticator, credentials);
    }
  }
});
