var assert = require("chai").assert;

var mongo = require('mongodb'),
    config = require('../../config'),
    logger = require('../../logger'),
    Model = require('../../model/model'),
    User = require('../../model/user'),
    Token = require('../../model/token');

suite('Token:', function(){
    var _user = null;

    suiteSetup(function(done){
        Model.init(function () {
            User.insert({ username:'tt', email: 'tt@k12.org', password: 'n0ne', isAdmin: false }, function(insertedUsers) {
                _user = insertedUsers[0];
                done();
            });
        });
    });

    suiteTeardown(function(done){
        Model.db.dropDatabase(function(err) {
            assert.isNull(err);
            Model.db.close();
            done();
        });
    });

    suite('basic:', function(){
        var _token = null;

        test('issue token', function(done){
            Token.issue({uid: _user._id}, function(insertedTokens) {
                assert.equal(_user._id, insertedTokens[0].uid);
                _token = insertedTokens[0];
                done();
            });
        });

        test('consume token', function(done){
            Token.consume(_token._id, function(consumedToken) {
                assert.notStrictEqual(_token._id, consumedToken._id);
                done();
            });
        });
    });
});
