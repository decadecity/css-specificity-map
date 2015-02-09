/*jslint node: true */
'use strict';

var stripMq = require('./strip-mq');
var specificity = require('specificity');

/**
 * Makes a numeric specificity from an array.
 *
 * @param breakdown {array} Specificity in the form [N,N,N,N]
 *
 * @returns {integer} Specificity in numeric form.
 */
function numericSepecificity(breakdown) {
  var specificity = 0;
  specificity += breakdown[3];
  specificity += breakdown[2] * 10;
  specificity += breakdown[1] * 100;
  return specificity;
}

/**
 * Makes a specificity array from a string.
 *
 * @param breakdown {string} Specificity in the form 'N,N,N,N'
 *
 * @returns {array} Specificity in the form [N,N,N,N]
 */
function speficityArray(breakdown) {
  return breakdown.split(',').map(function(item) {
    return parseInt(item, 10);
  });
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
M.parse = function generateMap(stylesheet, linear_scale, no_id, important_specificity) {

  if (typeof stylesheet !== 'string') {
    throw new Error('Stylesheet is not a string');
  }

  important_specificity = parseInt(important_specificity, 10);
  if (isNaN(important_specificity)) {
    important_specificity = 1000;
  }

  if (no_id) {
    // If we're not using IDs then we need to drop the specificity of
    // `!important` by a power of 10 to avoid a gap in the graph.
    important_specificity = important_specificity / 10;
  }

  var result = [];

  var rules;
  try {
    rules = stripMq.parseStylesheet(stylesheet);
  } catch (e) {
    throw new Error('Unable to parse stylesheet');
  }

  // Walk through the parsed stylesheet rules.
  rules.forEach(function iterateRules(rule) {
    if (rule.selectors && rule.selectors.length) {

      // Look for an `!important` annotation in this rule's declarations.
      var important = false;
      rule.declarations.forEach(function iterateDeclarations(rule) {
        if (!important && rule.value && rule.value.indexOf('!important') > -1) {
          important = true;
        }
      });

      // Walk through the selectors using this rule.
      rule.selectors.forEach(function iterateSelectors(selector) {
        var breakdown = specificity.calculate(selector);

        var specificity_list = speficityArray(breakdown[0].specificity);

        if (no_id && specificity_list[1]) {
          throw new Error('Found an ID but noID was enabled');
        }

        // Data point on the graph for this selector.
        var data = {
          specificity: numericSepecificity(specificity_list),
          selector: selector,
          // To cope with minified CSS we don't use the line number that
          // the CSS parser gets us, we count selectors to give us the
          //source order.
          position: result.length
        };

        if (important) {
          data.specificity += important_specificity;
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
          data.specificity = parseFloat((Math.log(data.specificity) / Math.log(10)).toFixed(3));
        }

        result.push(data);
      });

    }
  });

  return result;
};

/**
 * Short cut function with defaults set for not using IDs as selectors.
 *
 * @param stylesheet {string} CSS to parse.
 *
 * @returns {array} Sequence of data points containing specificity, selector and position.
 */
M.noId = function generateMapNoId(stylesheet) {
  return M.parse(stylesheet, false, true);
};

module.exports = M;
