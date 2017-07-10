import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import run from 'ember-runloop';

moduleForComponent('js-pdf', 'Integration | Component | js pdf', {
  integration: true
});

test('it renders a base64 PDF from a list of steps', function(assert) {
  this.set('steps', [{text: [35, 25, 'Test PDF']}])
  this.render(hbs`{{js-pdf steps}}`);
  assert.equal(this.$('object').attr('data').slice(0, 35), 'data:application/pdf;base64,JVBERi0');
});

test('it renders a new PDF when steps are added', function(assert) {
  const steps = this.set('steps', Ember.A([{text: [35, 25, 'Test PDF']}]));
  this.render(hbs`{{js-pdf steps}}`);

  const initialBase64Steps = this.$('object').attr('data');

  run(() => steps.pushObject({text: [35, 100, 'More test']}));

  run(() => {
    const updatedBase64Steps = this.$('object').attr('data');
    assert.notEqual(initialBase64Steps, updatedBase64Steps, 'steps were updated');
  });
});

test('it enforces a string with type `.pdf` as filename', function(assert) {
  this.set('steps', []);
  this.render(hbs`{{#js-pdf steps filename=false as |pdf|}}
    <div id="pdf-filename">{{pdf.filename}}</div>
  {{/js-pdf}}`);

  assert.strictEqual(this.$('#pdf-filename').text().trim(), 'false.pdf');
});
