import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    reset() {
      let email = this.getProperties('email').email;
      let record = this.get('store').createRecord('reset-password', {'email': email});

      record.save().then(
        (res) => {
        },
        (err) => {
          this.set('errorMessage', err);
      });
    }
  }
});
