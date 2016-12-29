import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    save() {
      let newPassword = this.getProperties('newPassword').newPassword;
      let confirmPassword = this.getProperties('confirmPassword').confirmPassword;
      let resetToken = 'p4ROi4ErVYSaEgbc';
      let record = this.get('store').createRecord('new-password', {
        'newpassword': newPassword,
        'confirmpassword': confirmPassword,
        'resettoken': resetToken
      });
      console.log(newPassword, resetToken, confirmPassword);
      record.save();
    }
  }
});
