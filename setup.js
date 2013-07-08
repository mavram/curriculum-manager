/**
 * Setup code
 */

var User = require('./models/user')
    , Curriculum = require('./models/curriculum')
    , Subject = require('./models/subject');



exports._createUsers = function(callback) {
    User.createUser('ma', 'ma@akademeia.org', 'think4me', true, callback);
    User.createUser('ak', 'ak@akademeia.org', 'think4u', true, callback);
    User.createUser('aa', 'aa@akademeia.org', 'passw0rd', true, callback);
    User.createUser('zz', 'zz@akademeia.org', 'n0ne', false, callback);
    User.createUser('akademos', 'akademos@akademeia.org', 'n0ne', false, callback);
};


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
