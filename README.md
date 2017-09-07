[![Build Status](https://travis-ci.org/Matt-Jensen/ember-js-pdf.svg?branch=master)](https://travis-ci.org/Matt-Jensen/ember-js-pdf)
[![Ember Observer Score](http://emberobserver.com/badges/ember-js-pdf.svg)](http://emberobserver.com/addons/ember-js-pdf)

# ember-js-pdf

Generate, render, and save PDF files in the browser with [jsPDF](https://github.com/MrRio/jsPDF). See [examples of jsPDF](https://parall.ax/products/jspdf).

## Installation

* `ember install ember-js-pdf`

## Usage

Render a PDF from an Array of steps:

```hbs
{{js-pdf steps filename="tomster-facts"}}
```

Where:
```js
export default Controller.extend({
  steps: [
    {setFontSize: 40},
    {text: [35, 25, 'Tomsters loves jsPDF']}
  ]
});
```

Steps are arrays of PDF rendering commands with an array of arguments.  All [PDF rendering commands are listed here](https://github.com/Matt-Jensen/ember-js-pdf/blob/master/addon/commands.js), with additional [documentation of their arguments here](http://rawgit.com/MrRio/jsPDF/master/docs/index.html).

Saving PDFs:
```hbs
{{#js-pdf steps as |pdf|}}
  <button {{action pdf.save}}>Download PDF</button>
{{/js-pdf}}
```

Rendering from a URL:
```hbs
{{js-pdf src="https://bitcoin.org/bitcoin.pdf"}}
```

Toggling PDF visibility:
```hbs
{{#js-pdf showPdf=false as |pdf|}}
  <h1>{{pdf.filename}} is visible</h1>
  {{!-- PDF Not visible --}}
{{/js-pdf}}
```

## Misc Options

| Property    | Type    | Default | Available                 |
| ----------- | ------- | ------- | ------------------------- |
| orientation | String  | p       | portrait, landscape, p, l |
| unit        | String  | mm      | pt, mm, cm, in            |
| format      | String  | a4      | a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, dl, letter, government-letter, legal, junior-legal, ledger, tabloid, credit-card |
| compressPdf | Boolean | false   | true, false               |

## Contributing

* `git clone <repository-url>` this repository
* `cd ember-js-pdf`
* `yarn`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
