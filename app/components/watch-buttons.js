import Ember from 'ember';

export default Ember.Component.extend({
  isHovered: false,
  actions: {
    hover() {
      this.setProperties({isHovered: 'true'});
    }
  },
  mouseLeave() {
    this.toggleProperty('isHovered');
  }
});
