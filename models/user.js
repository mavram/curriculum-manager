/*
 * User Model
 */

var mongoose = require('mongoose')
    , bcrypt = require('bcrypt')
    , Schema = mongoose.Schema;

var  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    creationDate: {type: Date, default: Date.now},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    isAdmin: { type: Boolean, default: false }
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

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

var encryptPassword = function (password, callback) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return callback(err);
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return callback(err);
            }

            console.log('DEBUG: ' + password + ' encrypted as ' + hash);
            callback(null, hash);
        });
    });
};

exports.createUser = function (username, email, password, isAdmin, callback) {
    encryptPassword(password, function(err, encryptedPassword) {
        if (err) {
            console.log('ERROR: Failed to create user: ' + username + '. ' + err);
            return;
        }

        new UserModel({
            username: username,
            email: email,
            password: encryptedPassword,
            isAdmin: isAdmin
        }).save(callback);
    });
};
