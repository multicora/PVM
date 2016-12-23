import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  conversation: DS.attr('string'),
  author: DS.attr('string')
});
