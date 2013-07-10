/*
 * Category Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../config');


var CategorySchema = new Schema({
    name: { type: String, required: true, unique: true }
});

if (config.get('env') === 'prod') {
    CategorySchema.set('autoIndex', false);
}

CategorySchema.statics.findAll = function (next) {
    Category.find(function (err, categories) {
        if (err) {
            throw new Error('Failed to find categories. ' + err.message);
        }
        next (categories);
    });
}

CategorySchema.statics.findUnique = function (id, next) {
    Category.findById(id, function (err, category) {
        if (err) {
            throw new Error('Failed to find category by id ' + id + '. ' + err.message);
        }
        next (category);
    });
}

CategorySchema.statics.create = function (name, next) {
    var category = new Category({
        name: name
    });
    category.save(next);
}


var Category = mongoose.model('Category', CategorySchema);
module.exports = exports = Category;
