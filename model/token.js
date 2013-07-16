/*
 * Token Model
 */

var logger = require('../logger'),
    Model = require('./model');


var Token = function() {
    this.db = Model.db;
    this.options = Model.dbOptions;
};

Token.prototype.getCollection = function (next) {
    this.db.collection('tokens', function (err, collection) {
        if (err) {
            throw new Error('Failed to get the ' + name + ' collection. ' + err.message);
        }
        next(collection);
    });
};


Token.prototype.consume = function (id, next) {
    this.getCollection(function (collection) {
        collection.findOne({'_id': Model._id(id)}, function (err, token) {
            if (err) {
                throw new Error('Failed to find token ' + id + '. ' + err.message);
            }

            if (token) {
                collection.remove({'_id': token._id}, function (err, numberOfRemovedTokens) {
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

Token.prototype.issue = function (token, next) {
    this.getCollection(function (collection) {
        collection.insert(token, this.options, function (err, tokens) {
            if (err) {
                throw new Error('Failed to insert token for user ' + token.uid + '. ' + err.message);
            }
            next(tokens);
        });
    });
};

module.exports = exports = new Token(Model);


