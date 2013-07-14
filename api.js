/*
 *  API v.1
 */

var User = require('./models/user')
    , Category = require('./models/category')
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
};

exports.sendError = function(res, msg) {
    logger.log('error', msg);
    res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    return res.end(msg);
};

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
    try {
        Category.findAll(function(categories) {
            exports.sendResult(res, JSON.stringify(categories));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.addCategory = function (req, res) {
    logger.log('debug', 'add new category ' + req.body.name + ' for ' + req.body.subject + ' in grade ' + req.body.grade);

    try {
        Category.create(req.body.subject, req.body.grade, req.body.name, [], function(err, category) {
            exports.sendResult(res, JSON.stringify(category));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.removeCategory = function (req, res) {
    logger.log('debug', 'remove category ' + req.params.id);
    exports.sendError(res, "Not implemented");

//    try {
//        Category.findAll(function(categories) {
//            exports.sendResult(res, JSON.stringify(categories));
//        });
//    } catch(err) {
//        exports.sendError(res, err.message);
//    }
};

exports.addSkill = function (req, res) {
    logger.log('debug', 'add new skill ' + req.body.name + ' for category ' + req.params.categoryId);

    try {
        Category.addSkillToCategory(req.params.categoryId, req.body.name, function(err, skill) {
            exports.sendResult(res, JSON.stringify(skill));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.removeSkill = function (req, res) {
    logger.log('debug', 'remove skill ' + req.params.id + ' for category ' + req.params.categoryId);
    exports.sendError(res, "Not implemented");

//    try {
//        Skill.findAll(function(categories) {
//            exports.sendResult(res, JSON.stringify(categories));
//        });
//    } catch(err) {
//        exports.sendError(res, err.message);
//    }
};
