import Ember from 'ember';

export default Ember.Component.extend({
  segment: Ember.inject.service(),
  segmentEventName: null,
  click() {
    const eventName = this.get('segmentEventName');

    if (eventName) {
      this.get('segment').trackEvent(eventName);
    }
  }
});