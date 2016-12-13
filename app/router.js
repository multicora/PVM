import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('watch', {path: 'watch/:video_id'});
  this.route('library');
  this.route('auth');
});

export default Router;