# stylus-deps-to-css

Searches for stylus dependencies starting from a given root module. The stylus dependencies are declared in the package.json using the custom 'stylus' key.


## Install

Install as dev dependency:

```
npm install stylus-deps-to-css --save-dev
```


## Usage

```javascript

var stylusDepsToCss = require('stylus-deps-to-css');

var deps = stylusDepsToCss.create();
var rootDir = 'path/to/module'; // module contains a package.json

deps.convertStylusToCss(rootDir, function (css) {
  // do something with `css`
});
```


### API

- `create`: returns an object with the helper method(s):
  - `convertStylusToCss(modulePath, callback)`: walks the dependencies starting from `modulePath` and looks for the `stylus` key in the package.json. The `stylus` key should contain the path to the stylus file in the current module. Dependency modules under `dependencies` are checked recursively for `stylus` keys in the package.json.
