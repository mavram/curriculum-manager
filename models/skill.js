/*
 * Skill Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , config = require('../config');


var SkillSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

if (config.get('env') === 'prod') {
    SkillSchema.set('autoIndex', false);
}

SkillSchema.statics.findAll = function (next) {
    Skill.find(function (err, skills) {
        if (err) {
            throw new Error('Failed to find skills. ' + err.message);
        }
        next (skills);
    });
}

SkillSchema.statics.findUnique = function (id, next) {
    Skill.findById(id, function (err, skill) {
        if (err) {
            throw new Error('Failed to find skill by id ' + id + '. ' + err.message);
        }
        next (skill);
    });
}

SkillSchema.statics.create = function (name, next) {
    var skill = new Skill({
        name: name
    });
    skill.save(next);
}


var Skill = mongoose.model('Skill', SkillSchema);
module.exports = exports = Skill;
