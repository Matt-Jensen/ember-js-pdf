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
export Default Controller.extend({
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

## Contributing

* `git clone <repository-url>` this repository
* `cd ember-js-pdf`
* `npm install`

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
