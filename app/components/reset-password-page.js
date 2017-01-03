import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    reset() {
      let email = this.getProperties('email').email;
      let data = {'email': email};
      let self = this;

      $.ajax({
        type: "POST",
        url: 'reset-password',
        data: data,
        success: function() {
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
