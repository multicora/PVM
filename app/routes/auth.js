import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    redirect(uri) {
      this.transitionTo(uri);
    }
  }
});
