import Ember from 'ember';

const { Route, set } = Ember;

export default Ember.Route.extend({
  actions: {
    redirect(uri) {
      this.transitionTo(uri);
    }
  }
});
