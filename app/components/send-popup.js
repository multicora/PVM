import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  email: 'bizkonect.project@gmail.com',
  actions: {
    sendVideo() {
      console.log(this.get('video'));
      // let email = this.get('email');
      // let video = '1';
      // let author = '1';
      // let record = this.get('store').createRecord('conversation', {'email': email, 'video': video, 'author': author});
      // record.save();
    }
  }
});