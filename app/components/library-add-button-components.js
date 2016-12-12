import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showUploadPopup() {
      this.set('isShownUploadPopup', true);
    },
    showRecordPopup() {
      this.set('isShownRecordPopup', true);
    }
  }
});
