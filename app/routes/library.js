import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('video');
  },
  actions: {
    redirectToAuth(param) {
      console.log(123123123123123123123);
      console.log(param);
      // this.transitionTo('auth');
    }
  }
});
