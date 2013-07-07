/*
 *  API v.1
 */

var UserModel = require('./models/user');

exports.accountSettings = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify(req.user));
};
