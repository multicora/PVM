import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend(googlePageview, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('conversation', {path: 'conversation/:conversation_id'});
  this.route('library');
  this.route('auth');
});

export default Router;