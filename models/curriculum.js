/*
 * Curriculum Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var CurriculumSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

// For production
// CurriculumSchema.set('autoIndex', false);

var Curriculum = mongoose.model('Curriculum', CurriculumSchema);
module.exports = exports = Curriculum;
