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

    try {
        Curriculum.findAll(function(curricula) {
            res.end(JSON.stringify(curricula));
        });
    } catch (Error) {
        logger.log('error', 'Failed to get curricula. ' + err);
        // TODO: rest error
    }
};

exports.subjects = function (req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    try {
        Subject.findAll(function(subjects) {
            res.end(JSON.stringify(subjects));
        });
    } catch (Error) {
        logger.log('error', 'Failed to get subjects. ' + err);
        // TODO: rest error
    }
};

