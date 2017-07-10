/* eslint-env node */
'use strict';

const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-js-pdf',

  options: {
    nodeAssets: {
      'jspdf': {
        vendor: {
          srcDir: 'dist',
          include: ['jspdf.debug.js'],
          processTree(input) {
            return map(input, '**/*.js', (content) => {
              /*
               * Support Fastbook v1 and fix adler32cs package definition
               */
              return `if (typeof FastBoot === 'undefined') {
                ${content.replace(/define\(callback\)/g, 'define(\'adler32cs\', [], callback)')}
              }`;
            });
          }
        }
      }
    }
  },

  included() {
    this._super.included.apply(this, arguments);
    this._ensureThisImport();
    this.import('vendor/jspdf/jspdf.debug.js');
  },

  _ensureThisImport() {
    if (!this.import) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;

        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };

      this.import = function importShim(asset, options) {
        let app = this._findHost();
        app.import(asset, options);
      };
    }
  }
};
