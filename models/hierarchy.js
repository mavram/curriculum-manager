/*
 * Hierarchy loader
 */

var fs = require('fs')
    , logger = require('../logger')
    , Curriculum = require('./curriculum')
    , Subject = require('./subject')
    , Category = require('./category')
    , Skill = require('./skill');


exports.loadFromFile = function (fileName) {
    var data = fs.readFileSync(fileName);
    var hierarchy = JSON.parse(data);

    logger.log('debug', hierarchy);

    hierarchy.curricula.forEach( function(curriculm) {
        Curriculum.create(curriculm.name, function(err, curriculum){
            if (err) {
                logger.log('error', 'Failed to create curriculum. ' + err.message);
            }
        });
    });
    hierarchy.subjects.forEach( function(subject) {
        Subject.create(subject.name, function(err, persistedSubject){
            if (err) {
                logger.log('error', 'Failed to create subject. ' + err.message);
                return;
            }

            subject.categories.forEach( function(category) {
                Category.create(category.name, function(err, persistedCategory){
                    if (err) {
                        logger.log('error', 'Failed to create category. ' + err.message);
                        return;
                    }

                    category.skills.forEach( function(skill) {
                        Skill.create(skill.name, function(err, persistedSkill){
                            if (err) {
                                logger.log('error', 'Failed to create skill. ' + err.message);
                            }
                        });
                    });
                });
            });
        });
    });
}

