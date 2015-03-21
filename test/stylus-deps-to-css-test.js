'use strict';
/*globals describe, it, beforeEach */

var assert = require('assert');
var stylusDepsToCss = require('../lib/stylus-deps-to-css');

function count(needle, haystack) {
  var re = new RegExp(needle, 'g');
  return (haystack.match(re) || []).length;
}

function assertAppearances(needle, haystack, expectedAppearances) {
  assert.equal(count(needle, haystack), expectedAppearances);
}

describe('stylus-deps-to-css', function(){
  var deps;
  var rootDir;

  beforeEach(function () {
    rootDir = __dirname + '/fixture/moduleA';
    deps = stylusDepsToCss.create();
  });

  it('converts stylus to css', function(done){
    deps.convertStylusToCss(rootDir, function (css) {
      assertAppearances('.module-a', css, 1);
      assertAppearances('.module-b', css, 1);
      assertAppearances('.module-c', css, 1);
      assertAppearances('.module-d', css, 1);
      assertAppearances('.module-f', css, 1);
      assertAppearances('.module-g', css, 1);
      assertAppearances('.module-e', css, 0);
      assertAppearances('color: #f00', css, 1);
      done();
    });
  });
});
