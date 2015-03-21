# HTTP Browserify

The naming and usage of this package is not clear. Ideas and name were derived 
from another project.

## Usage

```js
var skHttpBrowserify = require('sk-http-browserify');

var hb = skHttpBrowserify.create();

hb.covertStylusToCss(rootDir, function (css) {
	...
});
```

