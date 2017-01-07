import Ember from 'ember';

export default Ember.Component.extend({
  eventName: null,
  click() {
    const eventCategory = this.get('eventCategory');
    const eventAction = this.get('eventAction');
    const eventLabel = this.get('eventLabel');

    if (eventCategory && eventAction) {
      ga('send', 'event', eventCategory, eventAction, eventLabel);
    }
  }
});