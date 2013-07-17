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

Category.prototype.insert = function (category, next) {
    this.getCollection(function (collection) {
        category.skills.forEach(function (s) {
            s._id = Model._generateId();
        });
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

Category.prototype.removeSkill = function (categoryId, skillId, next) {
    this.getCollection(function (collection) {
        collection.update({'_id': Model._id(categoryId)}, {$pull: {'skills': {'_id': Model._id(skillId)}}}, this.cfg, function (err/*, numberOfRemoved*/) {
            if (err) {
                throw new Error('Failed to remove skill ' + skillId + ' for category ' + categoryId + '. ' + err.message);
            }
            next({_id: skillId});
        });
    });
};


module.exports = exports = new Category(Model);


