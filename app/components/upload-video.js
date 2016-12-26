import Ember from 'ember';

export default Ember.Component.extend({
  isShown: true,
  isUploading: false,
  actions: {
    hidePopup() {
      this.set('isShown', false);
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
      this.set('isShown', false);
    },
    uploadStart() {
      this.set('isUploading', true);
    }
  }
});