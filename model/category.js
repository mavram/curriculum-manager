/*
 * Category Model
 */

var config = require('../config'),
    logger = require('../logger'),
    Model = require('./model');


var Category = function() {
    this.db = Model.db;
    this.cfg = Model.dbOptions;
};

Category.prototype.getCollection = function (next) {
    this.db.collection('categories', function (err, collection) {
        if (err) {
            throw new Error('Failed to get the ' + name + ' collection. ' + err.message);
        }
        next(collection);
    });
};

Category.prototype.update = function (query, updateDocument, next) {
    this.getCollection(function (collection) {
        collection.update(query, updateDocument, this.cfg, function (err, updateCount) {
            next(err, updateCount);
        });
    });
};

Category.prototype.insert = function (category, next) {
    this.getCollection(function (collection) {
        if (category.skills) {
            category.skills.forEach(function (s) {
                s._id = Model._generateId();
            });
        }
        collection.insert(category, this.cfg, function (err, categories) {
            if (err) {
                throw new Error('Failed to insert category ' + category.name + '. ' + err.message);
            }
            next(categories);
        });
    });
};

Category.prototype.findById = function (id, next) {
    this.getCollection(function (collection) {
        collection.findOne({'_id': Model._id(id)}, function (err, category) {
            if (err) {
                throw new Error('Failed to find category ' + id + '. ' + err.message);
            }
            next(category);
        });
    });
};

Category.prototype.updateName = function (id, name, next) {
    this.update({'_id': Model._id(id)}, {$set: {'name': name}}, function (err/*, updateCount*/) {
        if (err) {
            throw new Error('Failed to update category ' + id + ' name to ' + name + '. ' + err.message);
        }
        next();
    });
};

Category.prototype.findAll = function (next) {
    this.getCollection(function (collection) {
        collection.find().sort({ name: 1 }).toArray(function (err, categories) {
            if (err) {
                throw new Error('Failed to find categories. ' + err.message);
            }
            next(categories);
        });
    });
};

Category.prototype.remove = function (id, next) {
    this.getCollection(function (collection) {
        collection.remove({'_id': Model._id(id)}, function (err/*, numberOfRemoved*/) {
            if (err) {
                throw new Error('Failed to remove category ' + id + '. ' + err.message);
            }
            next({ _id: id });
        });
    });
};

Category.prototype.addSkill = function (categoryId, skill, next) {
    this.getCollection(function (collection) {
        skill._id = Model._generateId();
        collection.update({'_id': Model._id(categoryId)}, {$push: {'skills': skill}}, this.cfg, function (err/*, numberOfInserted*/) {
            if (err) {
                throw new Error('Failed to insert new skill ' + skill.name + ' for category ' + categoryId + '. ' + err.message);
            }
            next(skill);
        });
    });
};

Category.prototype.updateSkillName = function (categoryId, skillId, name, next) {
    this.update({'_id': Model._id(categoryId), "skills._id": Model._id(skillId)}, { $set: { "skills.$.name" : name } }, function (err/*, updateCount*/) {
        if (err) {
            throw new Error('Failed to update name to ' + name + ' for skill ' + skillId + ' and category ' + categoryId + '. ' + err.message);
        }
        next();
    });
};

Category.prototype.removeSkill = function (categoryId, skillId, next) {
    this.update({'_id': Model._id(categoryId)}, {$pull: {'skills': {'_id': Model._id(skillId)}}}, function (err/*, updateCount*/) {
        if (err) {
            throw new Error('Failed to remove skill ' + skillId + ' for category ' + categoryId + '. ' + err.message);
        }
        next({_id: skillId});
    });
};

Category.prototype.assignGradesToSkill = function (categoryId, skillId, grades, next) {
    this.update({'_id': Model._id(categoryId), "skills._id": Model._id(skillId)}, {$set: {"skills.$.grades" : grades}}, function (err/*, updateCount*/) {
        if (err) {
            throw new Error('Failed to assign grades' + JSON.stringify(grades) + ' for skill ' + skillId + ' and category ' + categoryId + '. ' + err.message);
        }
        next();
    });
};


module.exports = exports = new Category(Model);


