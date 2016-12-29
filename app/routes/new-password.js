import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
   category: {
     refreshModel: true
   }
  },
  model: function(params) {
   // This gets called upon entering 'articles' route
   // for the first time, and we opt into refiring it upon
   // query param changes by setting `refreshModel:true` above.

   // params has format of { category: "someValueOrJustNull" },
   // which we can just forward to the server.
   console.log(this.store.findQuery('reset_token', params));
  }
});
