import Ember from 'ember';

export default Ember.Route.extend({
  // beforeModel() {
  //   this.transitionTo('auth');
  // },
  model() {
    return this.store.findAll('video');
    // return [];
  }
});
