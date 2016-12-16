import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
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
