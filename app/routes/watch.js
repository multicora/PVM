import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    // return this.store.findRecord('video', 7);
    return Ember.RSVP.hash({
      video: this.store.findRecord('video', 7),
      user: {
        name: 'Ramon Vela',
        message: 'Hello Mark, I’ve made this video for you.',
        phone: '+12137132806',
        email: 'mspmarketingservices@gmail.com'
      }
    });
  }
});
