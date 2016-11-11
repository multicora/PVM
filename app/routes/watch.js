import Ember from 'ember';

let videos = [{
  id: '12312312312323',
  name: 'Roberto Goni',
  message: 'Hello, my name is.....',
  link: 'https://www.youtube.com/embed/VXEkoXgb4bI'
}];

export default Ember.Route.extend({
  model() {
  // model(id) {
    // return this.this.store.findRecord('video', id);
    return videos;
  }
});
