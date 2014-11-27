/*jslint node: true */
'use strict';

var css = require('css');

var M = {};

/**
 * Parses a stylesheet extracting rules nested in media queries.
 *
 * @param stylesheet {string} CSS to parse.
 *
 * @returns {array} List of rules extracted from the stylesheet.
 */
M.parseStylesheet = function extractRules(stylesheet) {
  var rules = [];

  /*
   * Recursively extracts rules from a parsed stylesheet item.
   *
   * @param item {object} A stylesheet parsed by the `css` module.
   */
  function parseRules(item) {
    if (item.type === 'rule') {
      rules.push(item);
    } else if (item.hasOwnProperty('rules')) {
      item.rules.forEach(function(item) {
        parseRules(item);
      });
    }
  }

  parseRules(css.parse(stylesheet).stylesheet);
  return rules;
};

module.exports = M;

