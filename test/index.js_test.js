var assert = require('assert');
var M = require('../src/index.js');  // our module

describe('CSS specificity map', function(){
  describe('Module M:', function(){
    it('Should have a `map` Method.', function(){
      assert.equal(typeof M, 'object');
      assert.equal(typeof M.map, 'function');
    });
    it('The `map` method should return an object.', function(){
      assert.equal(typeof M.map(), 'object');
    });
  });
});
