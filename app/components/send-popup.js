import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  isShown: true,
  email: 'bizkonect.project@gmail.com',
  actions: {
    sendVideo() {
      let message = {};
      message.email = this.getProperties('email');
      this.store.createRecord('conversation', message);
    }
  }
});
