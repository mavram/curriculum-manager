/*
 * Subject Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../config');

var SubjectSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

if (config.get('env') === 'prod') {
    SubjectSchema.set('autoIndex', false);
}

SubjectSchema.statics.findAll = function (id, next) {
    Subject.find(function (err, subjects) {
        if (err) {
            throw new Error('Failed to find subjects. ' + err.message);
        }
        next (null, subjects);
    });
}

SubjectSchema.statics.findUnique = function (id, next) {
    Subject.findById(id, function (err, subjects) {
        if (err) {
            throw new Error('Failed to find subject by id ' + id + '. ' + err.message);
        }
        next (null, subjects);
    });
}

var Subject = mongoose.model('Subject', SubjectSchema);
module.exports = exports = Subject;
