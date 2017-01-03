import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      let passwords = this.getProperties('newPassword', 'confirmPassword');
      let resetToken = this.get('resetToken');
      let data = {
        'newPassword': passwords.newPassword,
        'confirmPassword': passwords.confirmPassword,
        'resetToken': resetToken
      };
      let self = this;

      $.ajax({
        type: "POST",
        url: 'new-password',
        data: data,
        success: function() {
          Ember.run(function() {
            self.get('success')();
          });
        },
        error: function(err) {
          Ember.run(function() {
            self.set('errorMessage', JSON.parse(err.responseText).message);
        });
      },
        dataType: 'text'
      });
    }
  }
});
