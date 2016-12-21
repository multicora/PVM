import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    sendVideo() {
      let email = this.getProperties('email');
      let video = this.get('videoId');
      let record = this.get('store').createRecord('conversation', {'email': email.email, 'video': video});
      record.save();
    },
    hidePopup() {
      this.set('isShownSendPopup', false);
    }
  }
});