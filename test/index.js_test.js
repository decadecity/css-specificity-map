var assert = require('assert');
var M = require('../src/index.js');

describe('CSS specificity map', function(){
  describe('Module M:', function(){
    it('should have a `parse` Method.', function(){
      assert.equal(typeof M, 'object');
      assert.equal(typeof M.parse, 'function');
    });
    describe('M.parse()', function(){
      /* Basic correctness. */
      it('should return an array.', function(){
        assert.equal(typeof M.parse('').forEach, 'function');
      });
      it('should throw an error with non string input', function () {
        assert.throws(function() {M.parse();}, /Stylesheet is not a string/);
      });

      /* Default behaviour. */
      it('should return specificity -1 for the global selector.', function(){
        assert.deepEqual(
            M.parse('*{}'),
            [{
              "specificity": -1,
              "selector": "*",
              "position": 0
            }]);
      });
      it('should return specificity 0 for an element selector.', function(){
        assert.deepEqual(
            M.parse('body{}'),
            [{
              "specificity": 0,
              "selector": "body",
              "position": 0
            }]);
      });
      it('should return specificity 1 for a class selector.', function(){
        assert.deepEqual(
            M.parse('.class{}'),
            [{
              "specificity": 1,
              "selector": ".class",
              "position": 0
            }]);
      });
      it('should return specificity 2 for an ID selector.', function(){
        assert.deepEqual(
            M.parse('#id{}'),
            [{
              "specificity": 2,
              "selector": "#id",
              "position": 0
            }]);
      });
      it('should return specificity 3 for a rule with an `!important` annotation.', function(){
        assert.deepEqual(
            M.parse('*{color:red !important;}'),
            [{
              "specificity": 3,
              "selector": "* { !important }",
              "position": 0
            }]);
      });
      it('should combine specificity and selectors for a complex rule.', function(){
        assert.deepEqual(
            M.parse('* body .class #id {color:red !important;}'),
            [{
              "specificity": 3.046,
              "selector": "* body .class #id { !important }",
              "position": 0
            }]);
      });
      it('should handle a rule with multiple selectors.', function(){
        assert.deepEqual(
            M.parse('body, .class { color: red !important }'),
            [
              {
                "specificity": 3,
                "selector": "body { !important }",
                "position": 0
              },
              {
                "specificity": 3.004,
                "selector": ".class { !important }",
                "position": 1
              }
            ]);
      });

      describe('M.parse() with a linear scale', function(){
        it('should return specificity 0 for the global selector.', function(){
          assert.deepEqual(
              M.parse('*{}', true),
              [{
                "specificity": 0,
                "selector": "*",
                "position": 0
              }]);
        });
        it('should return specificity 1 for an element selector.', function(){
          assert.deepEqual(
              M.parse('body{}', true),
              [{
                "specificity": 1,
                "selector": "body",
                "position": 0
              }]);
        });
        it('should return specificity 10 for a class selector.', function(){
          assert.deepEqual(
              M.parse('.class{}', true),
              [{
                "specificity": 10,
                "selector": ".class",
                "position": 0
              }]);
        });
        it('should return specificity 100 for an ID selector.', function(){
          assert.deepEqual(
              M.parse('#id{}', true),
              [{
                "specificity": 100,
                "selector": "#id",
                "position": 0
              }]);
        });
        it('should return specificity 1000 for a rule with an `!important` annotation.', function(){
          assert.deepEqual(
              M.parse('*{color:red !important;}', true),
              [{
                "specificity": 1000,
                "selector": "* { !important }",
                "position": 0
              }]);
        });
      });

      describe('M.parse() without IDs', function(){
        it('should return specificity -1 for the global selector.', function(){
          assert.deepEqual(
              M.parse('*{}', false, true),
              [{
                "specificity": -1,
                "selector": "*",
                "position": 0
              }]);
        });
        it('should return specificity 0 for an element selector.', function(){
          assert.deepEqual(
              M.parse('body{}', false, true),
              [{
                "specificity": 0,
                "selector": "body",
                "position": 0
              }]);
        });
        it('should return specificity 1 for a class selector.', function(){
          assert.deepEqual(
              M.parse('.class{}', false, true),
              [{
                "specificity": 1,
                "selector": ".class",
                "position": 0
              }]);
        });
        it('should throw and error on an ID selector.', function(){
          assert.throws(function() {M.parse('#id{}', false, true);}, /Found an ID but noID was enabled/);
        });
        it('should return specificity 2 for a rule with an `!important` annotation.', function(){
          assert.deepEqual(
              M.parse('*{color:red !important;}', false, true),
              [{
                "specificity": 2,
                "selector": "* { !important }",
                "position": 0
              }]);
        });
      });

      describe('M.parse() with changed `!important` specificity.', function() {
        it('should return specificity 2 for a rule with an `!important` annotation when we change the specificity of important.', function(){
          assert.deepEqual(
              M.parse('*{color:red !important;}', false, false, 100),
              [{
                "specificity": 2,
                "selector": "* { !important }",
                "position": 0
              }]);
        });
        it('should return specificity 1 for a rule with an `!important` annotation when we change the specificity of important and declare no IDs.', function(){
          assert.deepEqual(
              M.parse('*{color:red !important;}', false, true, 100),
              [{
                "specificity": 1,
                "selector": "* { !important }",
                "position": 0
              }]);
        });
      });
    });
  });
});
