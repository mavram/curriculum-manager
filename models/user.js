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

// For production
// UserSchema.set('autoIndex', false);

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

var UserProfile = function (user) {
    this.username = user.username;
    this.email = user.email;
    this.creationDate = user.creationDate;
    this.isAdmin = user.isAdmin;
}
exports.UserProfile = UserProfile;

UserSchema.methods.asUserProfile = function() {
    return new UserProfile(this);
}

UserSchema.statics.createUser = function (username, email, password, isAdmin, callback) {
    var _encryptPassword = function (password, callback) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) {
                return callback(err);
            }
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    return callback(err);
                }

                console.log('DEBUG: ' + password + ' encrypted as ' + hash);
                return callback(null, hash);
            });
        });
    };

    _encryptPassword(password, function(err, encryptedPassword) {
        if (err) {
            callback(err);
        } else {
            new User({
                username: username,
                email: email,
                password: encryptedPassword,
                isAdmin: isAdmin
            }).save(callback);
        }
    });
};

var User = mongoose.model('User', UserSchema);
module.exports = exports = User;
