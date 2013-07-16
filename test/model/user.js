var assert = require("chai").assert;

var mongo = require('mongodb'),
    logger = require('../../logger'),
    Model = require('../../model/model'),
    User = require('../../model/user');

suite('User:', function(){
    suiteSetup(function(done){
        Model.init(function (err) {
            done();
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
        var _user = { username:'tt', email: 'tt@k12.org', password: 'n0ne', isAdmin: false};

        test('should insert user', function(done){
            User.insert(_user, function(users) {
                assert.equal(_user.username, users[0].username);
                _user._id = users[0]._id;
                done();
            });
        });

        test('should find all users', function(done){
            User.findAll(function(users) {
                assert.equal(1, users.length);
                assert.equal(_user.username, users[0].username);
                done();
            });
        });

        test('should find user by id', function(done){
            User.findById(_user._id, function(user) {
                assert.equal(_user.username, user.username);
                done();
            });
        });

        test('should find user by name', function(done){
            User.findByName(_user.username, function(user) {
                assert.equal(_user.username, user.username);
                done();
            });
        });

        test('should hash the user password', function(done){
            User.findAll(function(users) {
                User.comparePassword(users[0].password, 'n0ne', function(isMatch) {
                    assert(isMatch, 'passwords should match');
                    done();
                });
            });
        });
    });
});
