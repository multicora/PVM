import Ember from 'ember';

let videos = [{
  id: '12312312312323',
  name: 'Roberto Goni',
  message: 'Hello, my name is.....',
  link: 'https://www.youtube.com/embed/VXEkoXgb4bI'
}];

let iframeContainer = document.getElementById('video');
console.log(iframeContainer);

export default Ember.Route.extend({
  model(params) {
    // return this.store.findRecord('video', params.video_id);
    console.log(params.video_id);
    return videos;
  }
});
