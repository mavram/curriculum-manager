/*
 * Token Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TokenSchema = new Schema({
    uid : { type: String, unique: true },
});

// For production
// TokenSchema.set('autoIndex', false);

TokenSchema.statics.consumeToken = function (id, callback) {
    this.findOneAndRemove(id, callback);
};

TokenSchema.statics.consumeTokenForUser = function (uid, callback) {
    this.findOneAndRemove({uid: uid}, callback);
};

var Token = mongoose.model('Token', TokenSchema);
module.exports = exports = Token;
