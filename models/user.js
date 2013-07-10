/*
 * User Model
 */

var mongoose = require('mongoose')
    , assert = require('assert')
    , bcrypt = require('bcrypt')
    , Schema = mongoose.Schema
    , config = require('../config')
    , logger = require('../logger');

var  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    creationDate: {type: Date, default: Date.now},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    isAdmin: { type: Boolean, default: false }
})

if (config.get('env') === 'prod') {
    UserSchema.set('autoIndex', false);
}

UserSchema.methods.comparePassword = function (candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            throw new Error('Failed to compare against hased password.' + err.message);
        }
        next(null, isMatch);
    });
}

var UserProfile = function (user) {
    this.username = user.username;
    this.email = user.email;
    this.creationDate = user.creationDate;
    this.isAdmin = user.isAdmin;
}

UserSchema.methods.asUserProfile = function() {
    return new UserProfile(this);
}

UserSchema.statics.findAll = function (id, next) {
    User.find(function (err, users) {
        if (err) {
            throw new Error('Failed to find users. ' + err.message);
        }
        next (null, users);
    });
}

UserSchema.statics.findUnique = function (id, next) {
    User.findById(id, function (err, users) {
        if (err) {
            throw new Error('Failed to find user by id ' + id + '. ' + err.message);
        }
        next (null, users);
    });
}

UserSchema.statics.create = function (username, email, password, isAdmin, next) {
    var _encryptPassword = function (password, next) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) {
                throw new Error('Failed to generate salt. ' + err.message);
            }
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    throw new Error('Failed to hash the password. ' + err.message);
                }

                logger.log('debug', password + ' encrypted as ' + hash);
                return next(null, hash);
            });
        });
    };

    _encryptPassword(password, function(err, encryptedPassword) {
        assert(!err, 'Raised error expected.');

        new User({
            username: username,
            email: email,
            password: encryptedPassword,
            isAdmin: isAdmin
        }).save(next);
    });
}

var User = mongoose.model('User', UserSchema);
module.exports = exports = User;
