import Ember from 'ember';

export default Ember.Component.extend({
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
    error(err) {
      this.set('errorMessage', 'Error upload video: ' + err);
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