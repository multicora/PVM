import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('library-add-button-upload', 'Integration | Component | library add button upload', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{library-add-button-upload}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#library-add-button-upload}}
      template block text
    {{/library-add-button-upload}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
