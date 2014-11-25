var assert = require('assert');
var M = require('../src/index.js');  // our module

describe('CSS specificity map', function(){
  describe('Module M:', function(){
    it('should have a `parse` Method.', function(){
      assert.equal(typeof M, 'object');
      assert.equal(typeof M.parse, 'function');
    });
    describe('M.parse()', function(){
      it('should return an array.', function(){
        assert.equal(typeof M.parse('').forEach, 'function');
      });
      it('should throw an error with non string input', function () {
        assert.throws(function() {M.parse();}, /Stylesheet is not a string/);
      });
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
      it('should combine specificity and selectors for a complex rule', function(){
        assert.deepEqual(
            M.parse('* body .class #id {color:red !important;}'),
            [{
              "specificity": 3.046,
              "selector": "* body .class #id { !important }",
              "position": 0
            }]);
      });
    });
  });
});
