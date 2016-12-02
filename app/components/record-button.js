import Ember from 'ember';

export default Ember.Component.extend({
  isHovered: false,
  mouseEnter() {
    this.setProperties({isHovered: 'true'});
    this.get('hover')();
  }
});
