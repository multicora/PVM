import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    sendBtnClick() {
      this.get('onSendClick')();
    }
  }
});
