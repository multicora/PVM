import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    reset() {
      this.set('show', true);

      let email = this.getProperties('email').email;
      let data = {'email': email};
      let self = this;

      $.ajax({
        type: "POST",
        url: 'reset-password',
        data: data,
        success: function() {
          Ember.run(function() {
            self.set('errorMessage', null);
            self.set('successMessage', "A letter with the link for resetting password has been sent to your email.");
            self.set('show', false);
          });
        },
        error: function(err) {
          Ember.run(function() {
            self.set('successMessage', null);
            self.set('errorMessage', JSON.parse(err.responseText).message);
            self.set('show', false);
          });
        },
        dataType: 'JSON'
      });
    }
  }
});
