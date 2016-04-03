# json-schema loader for webpack

## Installation

`npm install @pr0da/json-schema-loader`

## Description

Enchanced json loader for webpack, which handles json schema references (`$ref`). The resolution is the following:
* Strip `prefix` from ref.
* Add `postfix` to ref
* Try to load json from the following path: `path.join(context, root, ref);`
* Merge object with the loaded json schema fragment.

### Limitations
* Does not support local $refs (aka `definitions`)
* Does not support remote loading (via http, etc.)
* Does not support recursive schema references (does not even safeguard it).

## Usage

``` javascript
var dummySchema = require('json-schema?prefix=http://some.site.somewhere/entry-schema#!./root.json');
// => returns file.json content as json parsed object
```

## Query Options

* **prefix**: e.g.: `'http://some.site.somewhere/entry-schema#'` (default: `''`);
* **postfix**: e.g.: `'.schema.json'` (default: `'.json'`).
* **root**: e.g.: `'src/schemas'` (default: `''`).

## License

MIT (http://www.opensource.org/licenses/mit-license.php)