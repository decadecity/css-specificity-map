var css = require('css');
var metrics = require('parker/metrics/All.js');

// Extract the function we need from parker.
var specificityPerSelector;
metrics.forEach(function(item) {
  if (item.id === "specificity-per-selector") {
    specificityPerSelector = item;
  }
});
/* istanbul ignore if */
if (typeof specificityPerSelector !== 'object' && typeof specificityPerSelector.measure !== 'function') {
  throw new Error('Couldn\'t find the specificity selector from parker.');
}

// Module API we'll expose.
var M = {};

M.parse = function (stylesheet, linear_scale, no_id, important_specificity) {
  'use strict';

  if (typeof stylesheet !== 'string') {
    throw new Error('Stylesheet is not a string');
  }
  important_specificity = important_specificity || 1000;

  if (no_id) {
    important_specificity = important_specificity / 10;
  }

  var result = [];

  // Source code order. To cope with minified CSS we don't use line
  // numbers from the CSS parser, we count selectors.
  var sequence = 0;

  // Walk through the parsed stylesheet rules.
  css.parse(stylesheet).stylesheet.rules.forEach(function iterateRules(rule) {

    if (rule.selectors && rule.selectors.length) {

      // Look for an `!important` annotation in this rule's declarations.
      var important = false;
      rule.declarations.forEach(function iterateDeclaration(rule) {
        if (!important && rule.value.indexOf('!important') > -1) {
          important = true;
        }
      });

      // Walk through the selectors in this rule.
      rule.selectors.forEach(function iterateSelectors(selector) {
        if (no_id && selector && selector.indexOf('#') > -1) {
          throw new Error('Found an ID but noID was enabled');
        }

        // This is the data point on the graph for this rule.
        var data = {
          specificity: specificityPerSelector.measure(selector),
          selector: selector,
          position:sequence
        };

        if (important) {
          data.specificity = data.specificity + important_specificity;
          data.selector += ' { !important }';
        }

        if (!linear_scale) {
          // We are using a log scale.
          if (data.specificity === 0) {
            // Can't have the log of a specificity of 0
            // so fudging to 10^-1
            data.specificity = 0.1;
          }
          data.specificity = Math.round(Math.log(data.specificity) / Math.log(10) * 1000) / 1000;
        }

        result.push(data);
        sequence += 1;
      });
    }
  });

  return result;
};

module.exports = M;
