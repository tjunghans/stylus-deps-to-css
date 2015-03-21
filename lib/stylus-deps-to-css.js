'use strict';

var fs = require('fs');
var stylus = require('stylus');

function getPjson(dir) {
  return JSON.parse(fs.readFileSync(dir + '/package.json'));
}

function getDependencies(pjson) {
  if (!pjson || !pjson.dependencies) {
    return [];
  }

  var pjsonDeps = pjson.dependencies;
  var dependencies = [];
  var dependencyName;

  for (dependencyName in pjsonDeps) {
    if (pjsonDeps.hasOwnProperty(dependencyName)) {
      dependencies.push(dependencyName);
    }
  }

  return dependencies;
}

function getStylusPath(pjson) {
  if (!pjson.stylus) {
    return;
  }

  // return stylus path without beginning './'
  return pjson.stylus.indexOf('./') === 0 ? pjson.stylus.substr(2) : ps;
}

// Yields callback with css
function readStylusFile(file, callback) {
  fs.readFile(file, function (err, data) {
    if (err) {
      throw err;
    }
    stylus.render(data.toString(), function (err, css) {
      if (err) {
        throw err;
      }
      callback(css);
    });
  });
}

function getCssFiles(rootDir, callback) {
  // depName cache to prevent duplicates
  var checkedDeps = {};

  var cssFiles = [];

  var globalDepCounter = 0;

  var rootStylus = getStylusPath(getPjson(rootDir));

  // Recursive function
  function getDepCss(dir) {

    var rootPjson = getPjson(dir);
    var deps = getDependencies(rootPjson);
    var depsCount = deps.length;
    globalDepCounter += depsCount;

    // iterate over each root dependency by dependency name
    deps.forEach(function (dependencyName) {

      var depPath = 'node_modules/' + dependencyName;
      var pjsonPath = dir + '/' + depPath + '/package.json';

      // read package.json
      fs.readFile(pjsonPath, function (err, file) {

        --globalDepCounter;

        if (!err && !checkedDeps[dependencyName]) {
          checkedDeps[dependencyName] = true;

          var pjson = JSON.parse(file);

          if (pjson.stylus) {
            cssFiles.push(dir + '/' + depPath + '/' + getStylusPath(pjson));
          }

          getDepCss(dir + '/' + depPath);
        }

        if (globalDepCounter === 0) {
          // Make sure root css comes last
          if (rootStylus) {
            cssFiles.push(rootDir + '/' + rootStylus);
          }
          callback(cssFiles);
        }

      });
    });

  }
  getDepCss(rootDir);
}

exports.create = function () {
  return {
    convertStylusToCss: function (rootDir, callback) {
      var numCssFiles;
      var cssFiles = [];

      getCssFiles(rootDir, function (stylusFiles) {
        numCssFiles = stylusFiles.length;

        stylusFiles.forEach(function (stylusFile) {
          readStylusFile(stylusFile, function (css) {
            cssFiles.push(css);

            if (cssFiles.length === numCssFiles) {
              callback(cssFiles.join('\n'));
            }
          });
        });
      });
    }
  }
};
