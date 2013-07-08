/*
 *  API v.1
 */

/*
 * User API
 */
var UserModel = require('./models/user');

exports.accountSettings = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    var UserProfile = function(user) {
        this.username = user.username;
        this.email = user.email;
        this.creationDate = user.creationDate;
        this.isAdmin = user.isAdmin;
    }

    res.end(JSON.stringify(new UserProfile(req.user)));
};


