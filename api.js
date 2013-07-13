/*
 *  API v.1
 */

var User = require('./models/user')
    , Curriculum = require('./models/curriculum')
    , Subject = require('./models/subject')
    , Category = require('./models/category')
    , Skill = require('./models/skill')
    , logger = require('./logger');


/*
 * API helpers
 */
exports.sendResult = function(res, result) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    return res.end(result);
}

exports.sendError = function(res, msg) {
    logger.log('error', msg);
    res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    return res.end(msg);
}

/*
 * User API
 */
exports.settings = function (req, res) {
    exports.sendResult(res, JSON.stringify(req.user.asUserProfile()));
};


/*
 * Hierarchy API
 */
exports.subjects = function (req, res) {
    var subjects = ['Math', 'Science'];
    exports.sendResult(res, JSON.stringify(subjects));
};

exports.grades = function (req, res) {
    var grades = [1, 2, 3, 4, 5, 6, 7, 8];
    exports.sendResult(res, JSON.stringify(grades));
};

exports.categories = function (req, res) {

    var categories = {
        "Math": {
            "1" : ["M1.1",],
            "2" : ["M2.1", "M2.2"],
            "3" : ["M3.1", "M3.2", "M3.3"]
        },
        "Science": {
            "1" : ["S1.1",],
            "2" : ["S2.1", "S2.2"],
            "3" : ["S3.1", "S3.2", "S3.3"]
        }
    };

    exports.sendResult(res, JSON.stringify(categories));
};
