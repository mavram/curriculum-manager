/*
 * Category Model
 */

var logger = require('../logger'),
    Model = require('./model');


var Category = function() {
    this.db = Model.db;
    this.options = Model.dbOptions;
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
        collection.insert(category, this.options, function (err, categories) {
            if (err) {
                throw new Error('Failed to insert category ' + category.name + '. ' + err.message);
            }
            next(categories);
        });
    });
};

Category.prototype.findAll = function (next) {
    this.getCollection(function (collection) {
        collection.find().toArray(function (err, categories) {
            if (err) {
                throw new Error('Failed to find categories. ' + err.message);
            }
            next(categories);
        });
    });
};

Category.prototype.remove = function (id, next) {
    this.getCollection(function (collection) {
        collection.remove({'_id': Model._id(id)}, function (err, numberOfRemovedCategories) {
            if (err) {
                throw new Error('Failed to remove category ' + id + '. ' + err.message);
            }
            next(numberOfRemovedCategories ? { _id: id } : {});
        });
    });
};

module.exports = exports = new Category(Model);


