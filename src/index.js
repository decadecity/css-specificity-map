var css = require('css');
var metrics = require('parker/metrics/All.js');

var specificityPerSelector;

// Filename may very well change, so let's just look for the id
metrics.map(function(item) {
  if (item.id === "specificity-per-selector") {
    specificityPerSelector = item;
  }
});

/* istanbul ignore if */
if (typeof specificityPerSelector !== 'object' && typeof specificityPerSelector.measure !== 'function') {
  throw new Error('Couldn\'t find the specificity selector from parker.');
}

// Module API.
var M = {};

M.parse = function (stylesheet, linear_scale, no_id, important_specificity) {
  'use strict';

  important_specificity = important_specificity || 1000;

  if (typeof stylesheet !== 'string') {
    throw new Error('Stylesheet is not a string');
  }

  // Source code order. To cope with minified CSS we don't use line
  // numbers from the CSS parser, we count rules.
  var sequence = 0;

  // This is the output.
  var specificityMap = [];

  // Walk through the parsed stylesheet rules.
  css.parse(stylesheet).stylesheet.rules.forEach(function iterateRules(rule) {

    // This is going to be the data point on the graph for this rule.
    var data = {
      specificity: 0,
      selector: '',
      position:sequence
    };

    if (rule.selectors && rule.selectors.length) {
      rule.selectors.forEach(function iterateSelectors(selector) {
        data.specificity = specificityPerSelector.measure(selector);
        data.selector = selector;
      });

      // Now look for any `!important` rules.
      rule.declarations.forEach(function iterateDeclaration(rule) {
        // Have we already had an important declaration? We only want to count one.
        var important = false;

        if (!important && rule.value.indexOf('!important') > -1) {
          important = true;
          // This is where we up the specificity if it contains !important.
          data.specificity = data.specificity + important_specificity;
          // Give us a clue in the output.
          data.selector += ' { !important }';
        }
      });

      if (!linear_scale) {
        // We are using a log scale.
        if (data.specificity === 0) {
          // Can't have the log of a specificity of 0
          // so fudging to 10^-1
          data.specificity = 0.1;
        }
        data.specificity = Math.round(Math.log(data.specificity) / Math.log(10) * 1000) / 1000;
      }

      specificityMap.push(data);
      sequence += 1;
    }
  });

  return specificityMap;
};

module.exports = M;
