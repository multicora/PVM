import Ember from 'ember';

export default Ember.Component.extend({
  isShowen: true,
  actions: {
    hidePopup() {
      this.toggleProperty('isShowen');
    }
  }
});
