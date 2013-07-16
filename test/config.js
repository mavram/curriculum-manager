var assert = require("chai").assert;
var config = require('../config');

suite('config:', function(){
    setup(function(){
        // ...
    });

    suite('basic:', function(){
        test('should run in testing mode', function(){
            assert.equal('test', process.env.NODE_ENV);
        });
        test('should use the test database', function(){
            assert.equal('db-test', config.get('database:name'));
        });
    });
});