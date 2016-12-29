import DS from 'ember-data';

export default DS.Model.extend({
  resettoken: DS.attr('string'),
  newpassword: DS.attr('string'),
  confirmpassword: DS.attr('string')
});
