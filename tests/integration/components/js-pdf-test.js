import { A } from '@ember/array';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

const PAGE_SIZES = {
  a0: {
    pt: {width: 2383.94, height: 3370.39}
  }
};

moduleForComponent('js-pdf', 'Integration | Component | js pdf', {
  integration: true
});

test('it renders a base64 PDF from a list of steps', function(assert) {
  this.set('steps', [{text: [35, 25, 'Test PDF']}])
  this.render(hbs`{{js-pdf steps}}`);
  assert.equal(this.$('object').attr('data').slice(0, 35), 'data:application/pdf;base64,JVBERi0');
});

test('it renders a new PDF when steps are added', function(assert) {
  const steps = this.set('steps', A([{text: [35, 25, 'Test PDF']}]));
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

test('it renders a PDF from a url set as `src`', function(assert) {
  const url = this.set('url', 'https://bitcoin.org/bitcoin.pdf');
  this.render(hbs`{{js-pdf src=url}}`);
  assert.strictEqual(this.$('.ember-js-pdf__frame').attr('data'), url, 'sets the url as the `data` value of the frame');
});

test('it creates PDF with the configured page format and measurment unit', function(assert) {
  this.set('steps', []);

  this.render(hbs`{{#js-pdf steps unit="pt" format="a0" as |pdf|}}
    <div id="pdf-page-width">{{pdf.content.internal.pageSize.width}}</div>
    <div id="pdf-page-height">{{pdf.content.internal.pageSize.height}}</div>
  {{/js-pdf}}`);

  assert.equal(this.$('#pdf-page-width').text().trim(), PAGE_SIZES.a0.pt.width);
  assert.equal(this.$('#pdf-page-height').text().trim(), PAGE_SIZES.a0.pt.height);
});

test('it renders a new PDF when orientation is updated', function(assert) {
  this.set('steps', A([{text: [35, 25, 'Test PDF']}]));
  this.set('orientation', 'portrait');
  this.render(hbs`{{js-pdf steps orientation=orientation}}`);

  const initialBase64Steps = this.$('object').attr('data');

  run(() => this.set('orientation', 'landscape'));

  run(() => {
    const updatedBase64Steps = this.$('object').attr('data');
    assert.notEqual(initialBase64Steps, updatedBase64Steps, 'orientation was updated');
  });
});

test('it only renders PDF frame when `showPdf` is true', function(assert) {
  assert.expect(2);

  this.set('showPdf', false);
  this.set('steps', []);

  this.render(hbs`{{js-pdf steps showPdf=showPdf}}`);
  assert.notOk(this.$('.ember-js-pdf__frame').length);

  run(() => {
    this.set('showPdf', true);
    assert.ok(this.$('.ember-js-pdf__frame').length);
  });
});

test('it invokes rendering steps on jsPDF instance when `showPdf` is false', function(assert) {
  this.set('steps', [{ text: ['test']}]);
  this.set('content', {
    output: () => '',
    save: () => {},
    text() {
      assert.ok(true, 'invoked `text` rendering step on pdf instance');
    }
  });

  this.render(hbs`{{#js-pdf steps content=content showPdf=false as |pdf|}}
    <button id="save" {{action pdf.save}}></button>
  {{/js-pdf}}`);
  this.$('#save').click();
});
