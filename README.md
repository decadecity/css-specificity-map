css-specificity-map
===================

Maps CSS specificity data for creating a [specificity graph](http://csswizardry.com/2014/10/the-specificity-graph/).

## Usage
The main method is `.parse()` which takes a CSS string and returns an array of data points.

### `parse(stylesheet, linear_scale, no_id, important_specificty)`

#### `stylesheet` [required]
Type: `String`

This is the CSS to parse.  If the CSS can't be parsed it will throw and error.

#### `linear_scale`
Type: `Boolean`
Default: `false`

By default the specificity is mapped to a logarithmic scale.  Setting this to `true` will use a  linear scale.

#### `no_id`
Type: `Boolean`
Default: `false`

If you aren't using IDs in your CSS then this will leave a gap of an order of magnitude in the specificty graph between classes and `!important` annotations.  By setting this to `true` the parser will produce a graph that doesn't measure IDs.

If you set this to true and the parser thinks it has found an ID it will throw an error.  This detection is just based on finding `#` in a selector so will be buggy.  However, it matches parker's ID specificity detection.

#### `important_specificity`
Type: `Integer`
Default: `1000`

The pseudo specificity assigned to a rule that contains an `!important` annotation.  If `no_id` is true then this is reduced by a factor of 10.

#### Result

For example, the following CSS:

    *{} body{} .main{} #content{} .hidden{display:none !important;}"

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
