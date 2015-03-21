'use strict';
/*globals describe, it, beforeEach */

var assert = require('assert');
var skHttpBrowserify = require('../lib/sk-http-browserify');

function count(needle, haystack) {
  var re = new RegExp(needle, 'g');
  return (haystack.match(re) || []).length;
}

describe('http-browserify', function(){
  var hb;
  var rootDir;

  beforeEach(function () {
    rootDir = __dirname + '/fixture/moduleA';
    hb = skHttpBrowserify.create();
  });

  it('converts stylus to css', function(done){
    hb.covertStylusToCss(rootDir, function (css) {
      assert.equal(count('.module-a', css), 1);
      assert.equal(count('.module-b', css), 1);
      assert.equal(count('.module-c', css), 1);
      assert.equal(count('.module-d', css), 1);
      assert.equal(count('.module-f', css), 1);
      assert.equal(count('.module-g', css), 1);
      assert.equal(count('.module-e', css), 0);
      assert(css.indexOf('color: #f00') > -1);
      done();
    });
  });
});
