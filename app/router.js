import Ember from 'ember';
import config from './config/environment';
// import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('conversation', {path: 'conversation/:conversation_id'});
  this.route('library');
  this.route('auth');
});

Router.reopen({
  notifyGoogleAnalytics: function() {
    return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
  }.on('didTransition')
});

export default Router;