import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('conversation', {path: 'conversation/:conversation_id'});
  this.route('library');
  this.route('auth');
});

export default Router;