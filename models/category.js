///*
// * Category Model
// */
//
//var mongoose = require('mongoose')
//    , fs = require('fs')
//    , logger = require('../logger')
//    , Schema = mongoose.Schema
//    , config = require('../config');
//
//
//var CategorySchema = new Schema({
//    subject: { type: String, required: true },
//    grade: { type: Number, required: true },
//    name: { type: String, required: true },
//    skills: [{
//        name: String
//    }]
//});
//
//if (config.get('env') === 'prod') {
//    CategorySchema.set('autoIndex', false);
//}
//
//CategorySchema.statics.findAll = function (next) {
//    Category.find(function (err, categories) {
//        if (err) {
//            throw new Error('Failed to find categories. ' + err.message);
//        }
//        next (categories);
//    });
//};
//
//CategorySchema.statics.findUnique = function (id, next) {
//    Category.findById(id, function (err, category) {
//        if (err) {
//            throw new Error('Failed to find category by id ' + id + '. ' + err.message);
//        }
//        next (category);
//    });
//};
//
//CategorySchema.statics.create = function (subject, grade, name, skills, next) {
//    var category = new Category({
//        subject: subject,
//        grade: grade,
//        name: name,
//        skills: skills
//    });
//    category.save(next);
//};
//
//CategorySchema.statics.addSkillToCategory = function (categoryId, skillName, next) {
//    // TODO: implement
//};
//
//CategorySchema.statics.createDummyCategories = function() {
//    // TODO: support for save to/load from file
//    Category.create("Math", 1, "Addition", [{ name: "Addition - one digit" }, { name: "Addition with zero" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Math", 1, "Substraction", [{ name: "Substraction - one digit" }, { name: "Substraction up to 10" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Math", 2, "Substraction", [{ name: "Substraction two digits" }, { name: "Substraction up to 20" }, { name: "Substraction up to 100" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Math", 3, "Multiplication", [{ name: "Multiplication up to 3" }, { name: "Multiplication up to 6" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Math", 4, "Geometry", [{ name: "Perimeter" }, { name: "Area" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Math", 4, "Time", [{ name: "AM:PM" }, { name: "Events of the day" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Science", 2, "Weather", [{ name: "Rain" }, { name: "Water" }, { name: "Plants" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//    Category.create("Science", 2, "Electricity", [{ name: "Sources of electricity" }, { name: "Electrical current" }], function(err, category){
//        if (err) {
//            logger.log('error', 'Failed to create category. ' + err.message);
//        }
//    });
//};
//
//
//var Category = mongoose.model('Category', CategorySchema);
//module.exports = exports = Category;
