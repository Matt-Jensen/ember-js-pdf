import Component from 'ember-component';
import layout from '../templates/components/js-pdf';
import {assert} from 'ember-metal/utils';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

import COMMANDS from '../commands';

const {keys} = Object;
const {isArray} = Array;

const JsPdfComponent = Component.extend({
  layout,
  classNames: ['ember-js-pdf'],

  /**
   * Saved filename of generated PDF
   * @type {String}
   */
  filename: computed({
    get() {
      const id = this.element && this.element.id;
      return `${id || 'no-name'}.pdf`;
    },

    set(key, value = '') {

      // Enforce string as filename
      value = `${value}`;

      // Enforce `.pdf` file type
      if (value.search(/\.pdf$/i) === -1) {
        value = `${value}.pdf`;
      }

      return value;
    }
  }),

  /**
   * PDF iframe width
   * @type {String}
   */
  width: '100%',

  /**
   * PDF iframe height
   * @type {String}
   */
  height: '500px',

  /**
   * Current object generated from new jsPDF()
   * @type {Object}
   */
  content: null,

  /**
   * Base64 encoding of PDF document
   * @type {String}
   */
  src: computed('steps.[]', 'element', function() {
    if (!this.element) return '';

    const steps = get(this, 'steps');
    assert(`{{js-pdf}} requires an array of rendering steps`, isArray(steps));

    const doc = set(this, 'content', new jsPDF());
    addStepsToJsPdf(doc, steps);

    return doc.output('dataurlstring');
  }),

  willDestroyElement() {
    this._super(...arguments);
    set(this, 'content', null);
  },

  actions: {
    onSave() {
      const filename = get(this, 'filename');
      const action = get(this, 'onSave');
      const jsPdfInstance = get(this, 'content');

      if (action) {
        action(filename, get(this, 'src'));
      }

      if (jsPdfInstance) {
        jsPdfInstance.save(filename);
      }
    }
  }
});

export default JsPdfComponent.reopenClass({
  positionalParams: ['steps']
});

/**
 * Apply PDF rendering steps to a jsPDF Object
 * @param {Object} pdf        pdf generated from new jsPDF()
 * @param {Array}  steps      List of steps to render PDF
 *                            ie: [{text: [35, 25, 'pdf text'] }]
 */
function addStepsToJsPdf(pdf, steps = []) {
  for (let i = 0; i < steps.length; i++) {
    keys(steps[i]).forEach((command) => {
      assert(`{{js-pdf}} steps is given valid command: ${command}`, COMMANDS.indexOf(command) > -1);

      let args = steps[i][command];
      if (!isArray(args)) args = [args];

      pdf[command](...args);
    });
  }
}
