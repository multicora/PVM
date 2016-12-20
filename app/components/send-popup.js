import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  email: 'bizkonect.project@gmail.com',
  actions: {
    sendVideo() {
      let email = this.get('email');
      let video = this.get('videoId');
      let record = this.get('store').createRecord('conversation', {'email': email, 'video': video});
      record.save();
    },
    hidePopup() {
      this.set('isShownSendPopup', false);
    }
  }
});