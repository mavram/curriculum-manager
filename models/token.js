/*
 * Token Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../config');


var TokenSchema = new Schema({
    uid : { type: String, unique: true }
})

if (config.get('env') === 'prod') {
    TokenSchema.set('autoIndex', false);
}


TokenSchema.statics.consume = function (id, next) {
    this.findOneAndRemove(id, function (err, token) {
        if (err) {
            throw new Error('Failed to consume token ' + id + '. ' + err.message);
        }
        next (token);
    });
}

TokenSchema.statics.consumeForUser = function (uid, next) {
    this.findOneAndRemove({uid: uid}, function (err, token) {
        if (err) {
            throw new Error('Failed to consume token for user ' + uid + '. ' + err.message);
        }
        next (token);
    });
}

TokenSchema.statics.issue = function (uid, next) {
    var token = new Token({
        uid: uid
    });
    token.save(next);
}


var Token = mongoose.model('Token', TokenSchema);
module.exports = exports = Token;
