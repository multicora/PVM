import Ember from 'ember';

export default Ember.Component.extend({
  isShown: true,
  actions: {
    hidePopup() {
      this.toggleProperty('isShown');
    },
    uploadVideo() {
    }
  },
  setup: {
    controls: true,
    width: 320,
    height: 240,
    plugins: {
      record: {
        audio: true,
        video: true,
        maxLength: 10,
        debug: true
      }
    }
  }
});