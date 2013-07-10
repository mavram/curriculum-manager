/*
 * Curriculum Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../config');


var CurriculumSchema = new Schema({
    name: { type: String, required: true, unique: true }
}, { collection: 'curricula' });

if (config.get('env') === 'prod') {
    CurriculumSchema.set('autoIndex', false);
}

CurriculumSchema.statics.findAll = function (next) {
    Curriculum.find(function (err, curricula) {
        if (err) {
            throw new Error('Failed to find curricula. ' + err.message);
        }
        next (curricula);
    });
}

CurriculumSchema.statics.findUnique = function (id, next) {
    Curriculum.findById(id, function (err, curriculum) {
        if (err) {
            throw new Error('Failed to find curriculum by id ' + id + '. ' + err.message);
        }
        next (curriculum);
    });
}

CurriculumSchema.statics.create = function (name, next) {
    var curriculum = new Curriculum({
        name: name
    });
    curriculum.save(next);
}


var Curriculum = mongoose.model('Curriculum', CurriculumSchema);
module.exports = exports = Curriculum;
