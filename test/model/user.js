var assert = require("chai").assert;

var mongo = require('mongodb'),
    config = require('../../config'),
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
        var _user = { firstname:'tt', lastname:'t0t0', email: 'tt@k12.org', grade: 3, password: 'n0ne', isAdmin: false};

        test('insert user', function(done){
            User.insert(_user, function(users) {
                assert.equal(_user.firstname, users[0].firstname);
                _user._id = users[0]._id;
                done();
            });
        });

        test('find all users', function(done){
            User.findAll(function(users) {
                assert.equal(1, users.length);
                assert.equal(_user.firstname, users[0].firstname);
                done();
            });
        });

        test('find user by id', function(done){
            User.findById(_user._id, function(user) {
                assert.equal(_user.firstname, user.firstname);
                done();
            });
        });

        test('find user by email', function(done){
            User.findByEMail(_user.email, function(user) {
                assert.equal(_user.firstname, user.firstname);
                done();
            });
        });

        test('update user settings', function(done){
            User.updateSettings(_user._id, {firstname: 'f', lastname: 'l', grade: 6}, function() {
                User.findById(_user._id, function(user) {
                    assert.equal('f', user.firstname);
                    assert.equal('l', user.lastname);
                    assert.equal(6, user.grade);
                    done();
                });
            });
        });

        test('hash the user password', function(done){
            User.findAll(function(users) {
                User.comparePassword(users[0].password, 'n0ne', function(isMatch) {
                    assert(isMatch, 'passwords match');
                    done();
                });
            });
        });

        test('remove user', function(done){
            User.remove(_user._id, function(user) {
                assert.equal(_user._id, user._id);
                User.findAll(function(users) {
                    assert.equal(0, users.length);
                    done();
                });
            });
        });
    });
});
