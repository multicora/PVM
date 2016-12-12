import Ember from 'ember';

export default Ember.Component.extend({
  click: function() {
    this.set('isShownUploadPopup', true);
  }
});
