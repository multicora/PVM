import Ember from 'ember';

export default Ember.Component.extend({
	isShownTextArea: false,
	click() {
    this.setProperties({isShownTextArea: 'true'});
  }
});
