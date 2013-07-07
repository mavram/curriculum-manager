/*
 * User Model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    creationDate: {type: Date, default: Date.now},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    isAdmin: { type: Boolean, required: true }
});


var UserModel = mongoose.model('User', UserSchema);

exports.findById = function (id, callback) {
    UserModel.findById(id, callback);
};

exports.findByUsername = function (username, callback) {
    UserModel.findOne({'username': username}, callback);
};

exports.findUsers = function (callback) {
    UserModel.find(callback);
};

exports.createUser = function (username, email, password, isAdmin, callback) {
    var hashedPassword = password;
    var user = {
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: isAdmin
    };
    new UserModel(user).save(callback);
}
