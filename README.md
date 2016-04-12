# json-schema loader for webpack

## Installation

`npm install @pr0da/json-schema-loader`

## Description

Enchanced json loader for webpack, which handles json schema references (`$ref`). The loader uses [json-refs](https://github.com/whitlockjc/json-refs) to resolve references.

Additionally the loader can merger subschemas given by `allOf`.

## Usage

``` javascript
var dummySchema = require('json-schema!./root.json');
// => returns file.json content as json parsed object with resolved $ref's
```

## Query Options

* **mergeAllOf**: Optional parameter to merge subschemas given by the `allOf` keyword.
    * E.g.: `json-schema?mergeAllOf=true!./root.json` 
    * Default: `false`;

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)