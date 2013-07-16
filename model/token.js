/*
 * Token Model
 */

var mongo = require('mongodb');

var logger = require('../logger'),
    Model = require('./model');



var getCollection = function (db, name, next) {
    db.collection(name, function (err, collection) {
        if (err) {
            throw new Error('Failed to get the ' + name + ' collection. ' + err.message);
        }
        next(collection);
    });
};

var getTokensCollection = function (db, next) {
    getCollection(db, 'tokens', next);
};


exports.consume = function (id, next) {
    getTokensCollection(Model.db, function (collection) {
        collection.findOne({'_id': Model._id(id)}, function (err, token) {
            if (err) {
                throw new Error('Failed to find token ' + id + '. ' + err.message);
            }

            if (token) {
                collection.remove({'_id': token._id}, function (err) {
                    if (err) {
                        throw new Error('Failed to remove token ' + token._id + '. ' + err.message);
                    }
                    next(token);
                });
            } else {
                next(token);
            }
        });
    });
};

exports.issue = function (token, next) {
    getTokensCollection(Model.db, function (collection) {
        collection.insert(token, Model.options, function (err, insertedTokens) {
            if (err) {
                throw new Error('Failed to insert token for user' + token.uid + '. ' + err.message);
            }
            next(insertedTokens);
        });
    });
};


