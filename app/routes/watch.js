import Ember from 'ember';

let videos = [{
  id: '12312312312323',
  name: 'Say hello to #GoogleAllo',
  link: 'https://www.youtube.com/watch?v=VXEkoXgb4bI'
}];

export default Ember.Route.extend({
  model(id) {
    // return this.this.store.findRecord('video', id);
    return videos;
  }
});
