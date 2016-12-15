import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('video');
  },
  actions: {
    error: function(err) {
      if (err.errors[0].status === '401') {
        this.transitionTo('auth');
      } else {
        console.log(err.message);
      }
    },
    redirectToAuth(param) {
      console.log(123123123123123123123);
      console.log(param);
      // this.transitionTo('auth');
    }
  }
});
