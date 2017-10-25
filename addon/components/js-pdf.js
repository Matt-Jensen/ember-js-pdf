import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed, get, set, getProperties } from '@ember/object';
import layout from '../templates/components/js-pdf';

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
      return `${get(this, 'elementId') || 'no-name'}.pdf`;
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
   * Is PDF document rendered
   * @type {Boolean}
   */
  showPdf: true,

  /**
   * PDF frame width
   * @type {String}
   */
  width: '100%',

  /**
   * PDF frame height
   * @type {String}
   */
  height: '500px',

  /**
   * PDF document orientation
   * @type {String}
   */
  orientation: 'p',

  /**
   * Measurement unit used
   * @type {String}
   */
  unit: 'mm',

  /**
   * PDF page formats
   * @type {String}
   */
  format: 'a4',

  /**
   * Whether to compress output pdf
   * @type {Boolean}
   */
  compressPdf: false,

  /**
   * Current object generated from new jsPDF()
   * @type {Object}
   */
  content: computed('steps.[]', 'orientation', 'unit', 'format', 'compressPdf', {
    get() {
      const {
        orientation,
        unit,
        format,
        compressPdf
      } = getProperties(this, 'orientation', 'unit', 'format', 'compressPdf');

      assert('{{js-pdf}} requires a valid PDF `orientation`', typeof orientation === 'string' && orientation.length);
      assert('{{js-pdf}} requires a measurment as `unit`', typeof unit === 'string' && unit.length);
      assert('{{js-pdf}} requires a valid page `format`', typeof format === 'string' && format.length);

      return new jsPDF(orientation, unit, format, compressPdf);
    },

    set(key, value) {
      return value;
    }
  }),

  /**
   * Base64 encoding of PDF document
   * @type {String}
   */
  src: computed('steps.[]', 'orientation', 'unit', 'format', 'compressPdf', function() {
    const jsPdf = get(this, 'content');
    const steps = get(this, 'steps');

    assert('{{js-pdf}} requires an array of rendering steps', isArray(steps));
    addStepsToJsPdf(jsPdf, steps);

    return jsPdf.output('dataurlstring');
  }),

  /**
   * Trigger garbage collection of jsPDF instance
   */
  willDestroyElement() {
    this._super(...arguments);
    set(this, 'content', null);
  },

  actions: {
    onSave() {
      const filename = get(this, 'filename');
      const action = get(this, 'onSave');
      const jsPdfInstance = get(this, 'content');
      const src = get(this, 'src'); // ensure src computes

      if (action) {
        action(filename, src);
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
