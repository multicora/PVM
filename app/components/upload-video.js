import Ember from 'ember';

export default Ember.Component.extend({
  isShown: true,
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
    }
  }
});