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

    res.end(JSON.stringify(req.user.asUserProfile()));
};


