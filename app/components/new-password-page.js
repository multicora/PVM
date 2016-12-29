import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    save() {
      let passwords = this.getProperties('newPassword', 'confirmPassword');
      let resetToken = 'p4ROi4ErVYSaEgbc';
      let record = this.get('store').createRecord('new-password', {
        'new': passwords.newPassword,
        'confirm': passwords.confirmPassword,
        'token': resetToken
      });

      record.save();
    }
  }
});
