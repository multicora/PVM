import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    sendBtnClick() {
      let videoId = this.get('video').id;
      this.get('onSendClick')(videoId);
    }
  }
});
