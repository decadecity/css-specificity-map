css-specificity-map
===================

[![Build Status](https://travis-ci.org/decadecity/css-specificity-map.svg?branch=master)](https://travis-ci.org/decadecity/css-specificity-map)

Maps CSS specificity data for creating a [specificity graph](http://csswizardry.com/2014/10/the-specificity-graph/).  Based on experience of [using specificity graphs](https://decadecity.net/blog/2014/11/26/css-specificity-graphs).

Interactive example [running in the browser](https://decadecity.net/sprue/css-specificity-graph).

## Installation

### Using node
Install using npm: 

    npm install css-specificity-map

Include in your code:

    var cssSpecificityMap = require('css-specificity-map');

### In the browser
There is a browserify build available in the `src/` directory.  When included it will make this module available as `cssSpecificityMap` on the global object.

Include in your page:

    <script src="css-specificity-map.min.js"></script>

Use in your code:

    cssSpecificityMap.parse(/* CSS string */);

## Usage
The main method is `.parse()` which takes a CSS string and returns an array of data points.

There is also a second, shortcut, method `.noID()` which can be used if you aren't using ID selectors in your CSS.  This is equivalent to calling `.parse()` with `linear_scale`: `false` and `no_id`: `true`.

### `parse(stylesheet, linear_scale, no_id, important_specificty)`

#### `stylesheet` [required]

 * Type: `String`

This is the CSS to parse.  If the CSS can't be parsed it will throw an error.

#### `linear_scale`

 * Type: `Boolean`
 * Default: `false`

By default the specificity is mapped to a logarithmic scale.  Setting this to `true` will use a  linear scale.

#### `no_id`

* Type: `Boolean`
* Default: `false`

If you aren't using IDs in your CSS then this will leave a gap of an order of magnitude in the specificty graph between classes and `!important` annotations.  By setting this to `true` the parser will produce a graph that doesn't measure IDs.

If you set this to true and the parser finds an ID it will throw an error.

#### `important_specificity`

 * Type: `Integer`
 * Default: `1000`

The pseudo specificity assigned to a rule that contains an `!important` annotation.  If `no_id` is true then this is reduced by a factor of 10.

#### Result
The parser produces a sequence of data points with the following keys:

 * `position` (x axis)
 * `specificity` (y axis)
 * `selector` (annotation)

For example, the following CSS:

    "*{} body{} .main{} #content{} .hidden{display:none !important;}"

Would produce the following result:

    [
      {
        "specificity": -1,
        "selector": "*",
        "position": 1
      },
      {
        "specificity": 0,
        "selector": "body",
        "position": 2
      },
      {
        "specificity": 1,
        "selector": ".main",
        "position": 3
      },
      {
        "specificity": 2,
        "selector": "#content",
        "position": 4
      },
      {
        "specificity": 3.004,
        "selector": ".hidden { !important }",
        "position": 5
      }
    ]

## Known issues
Specificity is calculated as a decimal which will lead to 11 classes having higher specificity than an ID.  Whilst this is technically incorrect it is still suitable for the purposes of this visualisation.

## Release history

  * 2015-02-09: v1.0.1 - Fix for comment only lines.
  * 2014-11-28: v1.0.0 - First stable release.
