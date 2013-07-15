/*
 * Token Model
 */

var mongo = require('mongodb');

var logger = require('../logger'),
    Model = require('./model');



var _collection = function (db, name, next) {
    db.collection(name, function (err, collection) {
        if (err) {
            throw new Error('Failed to get the ' + name + ' collection. ' + err.message);
        }
        next(collection);
    });
};

var _tokensCollection = function (db, next) {
    _collection(db, 'tokens', next);
};


exports.consume = function (id, next) {
    _tokensCollection(Model.db, function (collection) {
        collection.findOne({'_id': Model._id(id)}, function (err, token) {
            if (err) {
                throw new Error('Failed to find token ' + id + '. ' + err.message);
            }

            if (token) {
                collection.remove({'_id': token._id}, function (err) {
                    if (err) {
                        throw new Error('Failed to remove token ' + token._id + '. ' + err.message);
                    }
                    next (token);
                });
            } else {
                next(token);
            }
        });
    });
};

exports.issue = function (token, next) {
    _tokensCollection(Model.db, function (collection) {
        collection.insert(token, Model.options, function (err, tokens) {
            if (err) {
                logger.log('warn', 'Failed to insert token for user' + token.uid + '. ' + err.message);
            }

            next(err, tokens[0]);
        });
    });
};


