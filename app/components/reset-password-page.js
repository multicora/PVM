import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    reset() {
      let email = this.getProperties('email').email;
      let data = {'email': email};

      $.ajax({
        type: "POST",
        url: 'reset-password',
        data: data,
        success: function(res) {
        },
        error: function(err) {
          Ember.run(function() {
            self.set('errorMessage', err);
        });
      },
        dataType: 'text'
      });
    }
  }
});
