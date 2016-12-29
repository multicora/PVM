import DS from 'ember-data';

export default DS.Model.extend({
  token: DS.attr('string'),
  new: DS.attr('string'),
  confirm: DS.attr('string')
});
