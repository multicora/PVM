import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  isShown: true,
  email: 'bizkonect.project@gmail.com',
  actions: {
    sendVideo() {
      let message = {
        email: this.get('email')
      };
      let record = this.get('store').createRecord('conversation', message);
      record.save();
    }
  }
});
