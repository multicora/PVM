import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  video: DS.attr('string'),
  author: DS.attr('string')
});
