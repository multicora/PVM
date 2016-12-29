import Ember from 'ember';

export default Ember.Route.extend({
  model: (params) => {
    return params.reset_token;
  },
  actions: {
    redirect(uri) {
      this.transitionTo(uri);
    }
  }
});
