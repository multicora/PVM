import Ember from 'ember';

export default Ember.Component.extend({
	isShownTextArea: false,
	disabledButton: true,
	click() {
    this.setProperties({disabledButton: 'false'});
    this.setProperties({isShownTextArea: 'true'});
  }
});
