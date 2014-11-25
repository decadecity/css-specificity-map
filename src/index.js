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

/**
 * Parse CSS to produce specificity data points.
 *
 * @param stylesheet {string} CSS to parse.
 * @param linear_scale {boolean} Should we use a liner scale? (optional - default: false)
 * @param no_id {boolean} Should we assume there are no ID's being used? (optional - default: false)
 * @param important_specificity {integer} Pseudo-specificity to assign to rules containing `!important` (optional - default: 1000)
 *
 * @returns {array} Sequence of data points containing specificity, selector and position.
 */
M.parse = function (stylesheet, linear_scale, no_id, important_specificity) {
  'use strict';

  if (typeof stylesheet !== 'string') {
    throw new Error('Stylesheet is not a string');
  }

  important_specificity = parseInt(important_specificity, 10);
  if (isNaN(important_specificity)) {
    important_specificity = 1000;
  }

  if (no_id) {
    important_specificity = important_specificity / 10;
  }

  var result = [];

  // Walk through the parsed stylesheet rules.
  css.parse(stylesheet).stylesheet.rules.forEach(function iterateRules(rule) {
    if (rule.selectors && rule.selectors.length) {

      // Look for an `!important` annotation in this rule's declarations.
      var important = false;
      rule.declarations.forEach(function iterateDeclarations(rule) {
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
          // To cope with minified CSS we don't use the line number that
          // the CSS parser gets us, we count selectors to give us the
          //source order.
          position: result.length
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
          // This needs a rounding fudge to cope with floating point maths.
          data.specificity = Math.round(Math.log(data.specificity) / Math.log(10) * 1000) / 1000;
        }

        result.push(data);
      });

    }
  });

  return result;
};

module.exports = M;
