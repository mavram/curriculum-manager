/**
 * Setup code
 */

var UserModel = require('./models/user')
    , CurriuculmModel = require('./models/curriculum');



exports._createUsers = function(callback) {
    UserModel.createUser('ma', 'ma@akademeia.org', 'think4me', true, callback);
    UserModel.createUser('ak', 'ak@akademeia.org', 'think4u', true, callback);
    UserModel.createUser('aa', 'aa@akademeia.org', 'passw0rd', true, callback);
    UserModel.createUser('zz', 'zz@akademeia.org', 'n0ne', false, callback);
    UserModel.createUser('akademos', 'akademos@akademeia.org', 'n0ne', false, callback);
};


exports._createCurriculums = function(callback) {
    CurriuculmModel.createCurriculm('British Columbia', callback);
    CurriuculmModel.createCurriculm('Ontario', callback);
    CurriuculmModel.createCurriculm('Quebec', callback);
};
