import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  didRender() {
    console.log(this.get('session').isAthenticated);
    if (this.get('session').isAthenticated) {
      console.log(222222);
    }
  }
});
