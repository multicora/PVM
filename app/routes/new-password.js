import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
   category: {
     refreshModel: true
   }
  },
  model: (params) => {
    return params.reset_token;
  }
});
