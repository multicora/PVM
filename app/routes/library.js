import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:application'
});

export default Ember.Route.extend({
  // beforeModel() {
  //   this.transitionTo('auth');
  // },
  model() {
    return this.store.findAll('video');
    // return [];
  }
});
