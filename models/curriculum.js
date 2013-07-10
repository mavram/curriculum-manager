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

CurriculumSchema.statics.findAll = function (id, next) {
    Curriculum.find(function (err, curricula) {
        if (err) {
            throw new Error('Failed to find curricula. ' + err.message);
        }
        next (null, curricula);
    });
}

CurriculumSchema.statics.findUnique = function (id, next) {
    Curriculum.findById(id, function (err, curricula) {
        if (err) {
            throw new Error('Failed to find curriculum by id ' + id + '. ' + err.message);
        }
        next (null, curricula);
    });
}

var Curriculum = mongoose.model('Curriculum', CurriculumSchema);
module.exports = exports = Curriculum;
