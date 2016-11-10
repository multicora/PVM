import DS from 'ember-data';

export default DS.Model.extend({
  video: DS.attr(),
  userId: DS.attr('string')
});
