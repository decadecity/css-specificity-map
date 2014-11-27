var assert = require('assert');
var M = require('../src/strip-mq.js');

describe('Strip media queries', function(){
  describe('Module M:', function(){
    it('should have a `parseStylesheet` Method.', function(){
      assert.equal(typeof M, 'object');
      assert.equal(typeof M.parseStylesheet, 'function');
    });
    describe('M.parseStylesheet', function() {
      it('should parse a stylesheet with no rules.', function() {
        assert.equal(M.parseStylesheet('').length, 0);
      });
      it('should parse a stylesheet with no MQs.', function() {
        assert.equal(M.parseStylesheet('body{}').length, 1);
      });
      it('should parse a stylesheet with an MQ.', function() {
        assert.equal(M.parseStylesheet('body{}@media only all{body{}}').length, 2);
      });
      it('should parse a rule with multiple selectors.', function() {
        assert.equal(M.parseStylesheet('body,p{}').length, 1);
      });
      it('should parse rules with multiple selectors including in an MQ.', function() {
        assert.equal(M.parseStylesheet('body,p{}@media only all{body,p{}}').length, 2);
      });
    });
  });
});
