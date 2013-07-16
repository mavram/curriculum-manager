/*
 * User Model
 */

var mongo = require('mongodb');

var logger = require('../logger'),
    bcrypt = require('bcrypt'),
    Model = require('./model');


var User = function() {
    this.db = Model.db;
    this.options = Model.dbOptions;
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
        username: user.username,
        email: user.email,
        creationDate: user.creationDate,
        isAdmin: user.isAdmin
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

User.prototype.findByName = function (username, next) {
    this.getCollection(function (collection) {
        collection.findOne({ 'username': username }, function (err, user) {
            if (err) {
                throw new Error('Failed to find user named ' + username + '. ' + err.message);
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
                    throw new Error('Failed to insert user ' + user.username + '. ' + err.message);
                }
                next(users);
            });
        });
    });
};

module.exports = exports = new User(Model);


//User.prototype.updateWine = function (req, res) {
//    var id = req.params.id;
//    var wine = req.body;
//    console.log('Updating wine: ' + id);
//    console.log(JSON.stringify(wine));
//   this.db.collection('wines', function (err, collection) {
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
//User.prototype.deleteWine = function (req, res) {
//    var id = req.params.id;
//    console.log('Deleting wine: ' + id);
//   this.db.collection('wines', function (err, collection) {
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
