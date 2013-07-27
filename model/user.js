/*
 * User Model
 */

var mongo = require('mongodb');

var config = require('../config'),
    logger = require('../logger'),
    bcrypt = require('bcrypt'),
    Model = require('./model');


var User = function() {
    this.db = Model.db;
    this.cfg = Model.dbOptions;
};


// TODO: add support for familiy account


User.prototype.getCollection = function (next) {
   this.db.collection('users', function (err, collection) {
        if (err) {
            throw new Error('Failed to get the ' + name + ' collection. ' + err.message);
        }
        next(collection);
    });
};


User.prototype.update = function (query, updateDocument, next) {
    this.getCollection(function (collection) {
        collection.update(query, updateDocument, this.cfg, function (err, updateCount) {
            next(err, updateCount);
        });
    });
};

User.prototype.comparePassword = function (password, candidatePassword, next) {
    bcrypt.compare(candidatePassword, password, function (err, isMatch) {
        if (err) {
            throw new Error('Failed to compare against hased password.' + err.message);
        }
        next(isMatch);
    });
};

User.prototype.asUserProfile = function (user) {
    return {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        grade: user.grade,
        email: user.email,
        creationDate: user.creationDate,
        isAdmin: user.isAdmin,
        password: "__secret__"
    };
};

User.prototype.findAll = function (next) {
    this.getCollection(function (collection) {
        collection.find().toArray(function (err, users) {
            if (err) {
                throw new Error('Failed to find users. ' + err.message);
            }
            next(users);
        });
    });
};

User.prototype.findById = function (id, next) {
    this.getCollection(function (collection) {
        collection.findOne({'_id': Model._id(id)}, function (err, user) {
            if (err) {
                throw new Error('Failed to find user ' + id + '. ' + err.message);
            }
            next(user);
        });
    });
};

User.prototype.findByEMail = function (email, next) {
    this.getCollection(function (collection) {
        collection.findOne({ 'email': email }, function (err, user) {
            if (err) {
                throw new Error('Failed to find user with email ' + email + '. ' + err.message);
            }
            next(user);
        });
    });
};

User.prototype.insert = function (user, next) {
    var _encryptPassword = function (password, next) {
        bcrypt.genSalt(12/**/, function (err, salt) {
            if (err) {
                throw new Error('Failed to generate salt. ' + err.message);
            }
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    throw new Error('Failed to hash the password. ' + err.message);
                }

                return next(hash);
            });
        });
    };

    this.getCollection(function (collection) {
        _encryptPassword(user.password, function (hash) {
            user.password = hash;
            user.creationDate = new Date();

            collection.insert(user, Model.dbOptions, function (err, users) {
                if (err) {
                    throw new Error('Failed to insert user ' + user.email + '. ' + err.message);
                }
                next(users);
            });
        });
    });
};


User.prototype.updateSettings = function (id, settings, next) {
    this.update({'_id': Model._id(id)}, {$set: settings}, function (err/*, updateCount*/) {
        if (err) {
            throw new Error('Failed to update user ' + id + ' settings with ' + JSON.stringify(settings) + '. ' + err.message);
        }
        next();
    });
};


User.prototype.remove = function (id, next) {
    this.getCollection(function (collection) {
        collection.remove({'_id': Model._id(id)}, function (err/*, numberOfRemoved*/) {
            if (err) {
                throw new Error('Failed to remove user ' + id + '. ' + err.message);
            }
            next({ _id: id });
        });
    });
};


module.exports = exports = new User(Model);
