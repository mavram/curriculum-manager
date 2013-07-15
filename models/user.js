/*
 * User Model
 */

var mongo = require('mongodb');

var logger = require('../logger'),
    bcrypt = require('bcrypt'),
    Model = require('./model');



// TODO: add support for familiy account


var _collection = function (db, name, next) {
    db.collection(name, function (err, collection) {
        if (err) {
            throw new Error('Failed to get the ' + name + ' collection. ' + err.message);
        }
        next(collection);
    });
};

var _usersCollection = function (db, next) {
    _collection(db, 'users', next);
};



exports.comparePassword = function (password, candidatePassword, next) {
    bcrypt.compare(candidatePassword, password, function (err, isMatch) {
        if (err) {
            throw new Error('Failed to compare against hased password.' + err.message);
        }
        next(isMatch);
    });
};

exports.asUserProfile = function (user) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        creationDate: user.creationDate,
        isAdmin: user.isAdmin
    };
};

exports.findAll = function (next) {
    _usersCollection(Model.db, function (collection) {
        collection.find().toArray(function (err, users) {
            if (err) {
                throw new Error('Failed to find users. ' + err.message);
            }
            next(users);
        });
    });
};

exports.findById = function (id, next) {
    _usersCollection(Model.db, function (collection) {
        collection.findOne({'_id': Model._id(id)}, function (err, user) {
            if (err) {
                throw new Error('Failed to find user ' + id + '. ' + err.message);
            }
            next(user);
        });
    });
};

exports.findByName = function (username, next) {
    _usersCollection(Model.db, function (collection) {
        collection.findOne({ 'username': username }, function (err, user) {
            if (err) {
                throw new Error('Failed to find user named ' + username + '. ' + err.message);
            }
            next(user);
        });
    });
};

exports.insert = function (user, next) {
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

    _encryptPassword(user.password, function (hash) {
        user.password = hash;
        user.creationDate = new Date();

        _usersCollection(Model.db, function (collection) {
            collection.insert(user, Model.options, function (err, insertedUser) {
                if (err) {
                    logger.warn('Failed to insert user ' + user.username + '. ' + err.message);
                }
                next(err, insertedUser);
            });
        });
    });
};


//exports.updateWine = function (req, res) {
//    var id = req.params.id;
//    var wine = req.body;
//    console.log('Updating wine: ' + id);
//    console.log(JSON.stringify(wine));
//    Model.db.collection('wines', function (err, collection) {
//        collection.update({'_id': new BSON.ObjectID(id)}, wine, {safe: true}, function (err, result) {
//            if (err) {
//                console.log('Error updating wine: ' + err);
//                res.send({'error': 'An error has occurred'});
//            } else {
//                console.log('' + result + ' document(s) updated');
//                res.send(wine);
//            }
//        });
//    });
//}
//
//exports.deleteWine = function (req, res) {
//    var id = req.params.id;
//    console.log('Deleting wine: ' + id);
//    Model.db.collection('wines', function (err, collection) {
//        collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function (err, result) {
//            if (err) {
//                res.send({'error': 'An error has occurred - ' + err});
//            } else {
//                console.log('' + result + ' document(s) deleted');
//                res.send(req.body);
//            }
//        });
//    });
//}
