import Ember from 'ember';

export default Ember.Component.extend({
  isShown: true,
  isUploading: false,
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
    },
    controlBar: {
      volumeMenuButton: false,
      fullscreenToggle: false
    }
  }
});