import Ember from 'ember';

export default Ember.Component.extend({
  isShown: false,
  isUploading: false,
  actions: {
    hidePopup() {
      this.toggleProperty('isShown');
    },
    upload(event) {
      let file = event.target.files[0];
      this.Store.update('video-update', file);
    },
    drop(event) {
      event.preventDefault();
      let file = event.dataTransfer.files[0];
      console.log(file);
    },
    uploadEnd() {
      this.set('isUploading', false);
    },
    uploadStart() {
      this.set('isUploading', true);
    }
  }
});