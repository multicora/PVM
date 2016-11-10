import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    confirm: function(data) {
      $.ajax({
        data: data,
        method: 'POST',
        url: '/save_video'
      }).then((digitalInventory) => {
        this.store.pushPayload(digitalInventory);
      });
    }
  }
});
