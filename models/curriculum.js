/*
 * Curriculum Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var CurriculumSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

var CurriculumModel = mongoose.model('Curriculum', CurriculumSchema);

exports.findById = function (id, callback) {
    CurriculumModel.findById(id, callback);
};

exports.findByName = function (name, callback) {
    CurriculumModel.findOne({'name': name}, callback);
};

exports.createCurriculum = function (name, callback) {
    new CurriculumModel({ name: name }).save(callback);
};
