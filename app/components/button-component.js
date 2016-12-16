import Ember from 'ember';

export default Ember.Component.extend({
  segment: Ember.inject.service(),
  segmentEventName: null,
  isShownSendPopup: false,
  click() {
    const eventName = this.get('segmentEventName');
    this.set('isShownSendPopup', true);
    console.log(this.get('isShownSendPopup'));

    if (eventName) {
      this.get('segment').trackEvent(eventName);
    }
  }
});