/*
 * Token Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../config');


var TokenSchema = new Schema({
    uid : { type: String, unique: true }
});

if (config.get('env') === 'prod') {
    TokenSchema.set('autoIndex', false);
}


TokenSchema.statics.consume = function (id, callback) {
    this.findOneAndRemove(id, callback);
};

TokenSchema.statics.consumeForUser = function (uid, callback) {
    this.findOneAndRemove({uid: uid}, callback);
};

var Token = mongoose.model('Token', TokenSchema);
module.exports = exports = Token;
