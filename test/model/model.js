var assert = require("chai").assert;

var mongo = require('mongodb'),
    Db = mongo.Db,
    ObjectID = mongo.ObjectID,
    Model = require('../../model/model');

suite('Model:', function(){
    setup(function(){
        // ...
    });

    suite('basic:', function(){
        test('use the test database', function(){
            assert.equal('db-test', Model.cfg.name);
        });
    });

    suite('_id:', function(){
        test('throw an exception for invalid id', function(){
            assert.throws(function () { Model._id('invalid'); }, Error, "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
        });
        test('accept string values', function(){
            assert.equal('51e372c24c95ec0000000002', Model._id('51e372c24c95ec0000000002'));
        });
        test('accept ObjectID values', function(){
            assert.equal('51e372c24c95ec0000000002', Model._id(new ObjectID('51e372c24c95ec0000000002')));
        });
        test('generate ObjectID', function(){
            assert.equal(24, Model._generateId().toHexString().length);
        });

    });
});