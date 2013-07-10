/**
 * Setup code
 */

var Curriculum = require('./models/curriculum')
    , Subject = require('./models/subject');


exports._createCurricula = function(callback) {
    new Curriculum({ name: 'Alberta'}).save(callback);
    new Curriculum({ name: 'British Columbia'}).save(callback);
    new Curriculum({ name: 'Manitoba'}).save(callback);
    new Curriculum({ name: 'Newfoundland and Labrador'}).save(callback);
    new Curriculum({ name: 'Northwest Territories'}).save(callback);
    new Curriculum({ name: 'Nova Scotia'}).save(callback);
    new Curriculum({ name: 'Nunavut'}).save(callback);
    new Curriculum({ name: 'Prince Edward Island'}).save(callback);
    new Curriculum({ name: 'Quebec'}).save(callback);
    new Curriculum({ name: 'Saskatchewan'}).save(callback);
    new Curriculum({ name: 'Yukon'}).save(callback);
};


exports._createSubjects = function(callback) {
    new Subject({ name: 'Mathematics'}).save(callback);
    new Subject({ name: 'English'}).save(callback);
    new Subject({ name: 'Physics'}).save(callback);
    new Subject({ name: 'Chemistry'}).save(callback);
    new Subject({ name: 'French'}).save(callback);
};
