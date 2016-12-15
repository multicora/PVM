import Ember from 'ember';

const { Route, set } = Ember;

export default Ember.Route.extend({
  actions: {
    redirect() {
      // handle action
      return 42;
    }
  }
});
