/*
 *  API v.1
 */

/*
 * User API
 */
var User = require('./models/user')
    , Curriculum = require('./models/curriculum');

exports.accountSettings = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(JSON.stringify(req.user.asUserProfile()));
};


exports.curricula = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    var curriculums =

    res.end(JSON.stringify(req.user.asUserProfile()));
};

