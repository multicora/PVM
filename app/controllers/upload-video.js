import Ember from 'ember';

export default Ember.Controller.extend({
  isShowen: true,
  actions: {
    hidePopup() {
      this.set('isShowen', false);
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