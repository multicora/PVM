import Ember from 'ember';

export default Ember.Component.extend({
	isShownTextArea: false,
	disabledButton: true,
	click() {
    this.set('disabledButton', false);
    this.set('isShownTextArea', true);
  }
});
