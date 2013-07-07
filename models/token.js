/*
 * Token Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TokenSchema = new Schema({
    uid : { type: String, unique: true },
});

var TokenModel = mongoose.model('Token', TokenSchema);

exports.consumeToken = function (id, callback) {
    TokenModel.findOneAndRemove(id, callback);
};

exports.consumeTokenForUser = function (uid, callback) {
    TokenModel.findOneAndRemove({uid: uid}, callback);
};

exports.createToken = function (uid, callback) {
    new TokenModel({uid: uid}).save(callback);
}
