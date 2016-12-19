import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onSendClick(param) {
      this.set('videoId', param)
      this.set('isShownSendPopup', true);
    }
  }
});
