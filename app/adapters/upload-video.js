import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  hosts: 'http://localhost:8081'
});
