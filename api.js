/*
 *  API v.1
 */

/*
 * User API
 */
var User = require('./models/user')
    , Curriculum = require('./models/curriculum')
    , Subject = require('./models/subject');

exports.accountSettings = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(JSON.stringify(req.user.asUserProfile()));
};


/*
 * Hierarchy API
 */

exports.curricula = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    Curriculum.find(function(err, curricula) {
        if (err) {
            console.log('ERR: Failed to get the curricula. ' + err);
            // TODO: Send REST Error
        } else {
            res.end(JSON.stringify(curricula));
        }
    });
};

exports.subjects = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    Subject.find(function(err, subjects) {
        if (err) {
            console.log('ERR: Failed to get the subjects. ' + err);
            // TODO: Send REST Error
        } else {
            res.end(JSON.stringify(subjects));
        }
    });
};

