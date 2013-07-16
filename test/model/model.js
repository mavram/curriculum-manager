var assert = require("chai").assert;

var mongo = require('mongodb'),
    Db = mongo.Db,
    ObjectID = mongo.ObjectID,
    Model = require('../../model/model');

suite('model:', function(){
    setup(function(){
        // ...
    });

    suite('basic:', function(){
        test('should use the test database', function(){
            assert.equal('db-test', Model.name);
        });
    });

    suite('_id:', function(){
// TODO: fix it!!!
//        test('should throw an exception for invalid id', function(){
//            assert.throw(Model._id('invalid'), Error, "Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
//        });
        test('should accept string values', function(){
            assert.equal('51e372c24c95ec0000000002', Model._id('51e372c24c95ec0000000002'));
        });
        test('should accept ObjectID values', function(){
            assert.equal('51e372c24c95ec0000000002', Model._id(new ObjectID('51e372c24c95ec0000000002')));
        });
    });
});