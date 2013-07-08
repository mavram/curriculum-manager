/*
 * Subject Model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var SubjectSchema = new Schema({
    name: { type: String, required: true, unique: true }
});

// For production
// SubjectSchema.set('autoIndex', false);

var Subject = mongoose.model('Subject', SubjectSchema);
module.exports = exports = Subject;
