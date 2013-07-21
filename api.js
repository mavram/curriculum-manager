/*
 *  API v.1
 */

var config = require('./config'),
    User = require('./model/user'),
    logger = require('./logger'),
    Model = require('./model/model');
    Category = require('./model/category');


/*
 * API helpers
 */
exports.sendResult = function(res, result) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    if (!result) {
        result = "OK";
    }
    return res.end(result);
};

exports.sendError = function(res, msg) {
    logger.error(msg);
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
    exports.sendResult(res, JSON.stringify(User.asUserProfile(req.user)));
};


/*
* Hierarchy API
*/
exports.subjects = function (req, res) {
    var subjects = ['Math', 'Science'];
    exports.sendResult(res, JSON.stringify(subjects));
};

exports.grades = function (req, res) {
    var grades = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
    logger.debug('add new category ' + req.body.name + ' for ' + req.body.subject);

    try {
        Category.insert({ subject: req.body.subject, name: req.body.name }, function(categories) {
            exports.sendResult(res, JSON.stringify(categories[0]));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.removeCategory = function (req, res) {
    logger.debug('remove category ' + req.params.id);

    try {
        Category.remove(req.params.id, function(category) {
            exports.sendResult(res, JSON.stringify(category));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.updateCategory = function (req, res) {
    logger.debug('update category ' + req.params.id + ' with ' + req.body.name);

    try {
        Category.updateName(req.params.id, req.body.name, function(/*category*/) {
            exports.sendResult(res);
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.addSkill = function (req, res) {
    logger.debug('add new skill ' + req.body.name + ' for category ' + req.params.categoryId);

    try {
        Category.addSkill(req.params.categoryId, { name: req.body.name }, function(skill) {
            exports.sendResult(res, JSON.stringify(skill));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.removeSkill = function (req, res) {
    logger.debug('remove skill ' + req.params.id + ' for category ' + req.params.categoryId);

    try {
        Category.removeSkill(req.params.categoryId, req.params.id, function(skill) {
            exports.sendResult(res, JSON.stringify(skill));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.updateSkill = function (req, res) {
    logger.debug('update skill ' + req.params.id + ' for category ' + req.params.categoryId + ' with ' + req.body.name);

    try {
        Category.updateSkillName(req.params.categoryId, req.params.id, req.body.name, function() {
            exports.sendResult(res);
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};


exports.updateSkillGrades = function (req, res) {
    logger.debug('update grades ' + JSON.stringify(req.body.grades) + ' for skill ' + req.params.id + ' for category ' + req.params.categoryId);

    try {
        Category.updateSkillGrades(req.params.categoryId, req.params.id, req.body.grades, function() {
            exports.sendResult(res);
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};

exports.categoriesByGradeAndSubject = function(req, res) {
    //logger.debug('categories by ' + req.params.grade + ' and ' + req.params.subject);

    try {
        Category.findByGradeAndSubject(req.params.grade, req.params.subject, function(categories) {
            exports.sendResult(res, JSON.stringify(categories));
        });
    } catch(err) {
        exports.sendError(res, err.message);
    }
};
