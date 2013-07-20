var assert = require("chai").assert;

var mongo = require('mongodb'),
    config = require('../../config'),
    logger = require('../../logger'),
    Model = require('../../model/model'),
    Category = require('../../model/category');

suite('Category:', function(){
    suiteSetup(function(done){
        Model.init(function (err) {
            done();
        });
    });

    suiteTeardown(function(done){
        Model.db.dropDatabase(function(err) {
            assert.isNull(err);
            Model.db.close();
            done();
        });
    });

    suite('basic:', function(){
        var _category = { subject:'Math', name: 'Addition'};
        var _nameForUpdate = 'UpdatedAddition';

        test('insert category', function(done){
            Category.insert(_category, function(categories) {
                assert.equal(_category.name, categories[0].name);
                _category._id = categories[0]._id;
                done();
            });
        });

        test('find all categories', function(done){
            Category.findAll(function(categories) {
                assert.equal(1, categories.length);
                assert.equal(_category.name, categories[0].name);
                done();
            });
        });

        test('update category name', function(done){
            Category.updateName(_category._id, _nameForUpdate, function() {
                Category.findById(_category._id, function(category) {
                    assert.equal(_nameForUpdate, category.name);
                    assert.equal(_category.subject, category.subject);
                    done();
                });
            });
        });

        test('remove category', function(done){
            Category.remove(_category._id, function(category) {
                assert.equal(_category._id, category._id);
                done();
            });
        });
    });

    suite('skills:', function(){
        var _category = { subject: 'Math', name: 'AdditionWithSkills'};
        var _skill = { name: 'SkillName' };
        var _nameForUpdate = 'UpdatedSkillName';

        test('insert category with no skills', function(done){
            Category.insert(_category, function(categories) {
                assert.equal(_category.name, categories[0].name);
                assert.isUndefined(categories[0].skills);
                _category._id = categories[0]._id;
                done();
            });
        });

        test('insert a new skill', function(done){
            Category.addSkill(_category._id, _skill, function(skill) {
                _skill._id = skill._id;
                Category.findById(_category._id, function(category){
                    assert.equal(_category.name, category.name);
                    assert.equal(_category.subject, category.subject);
                    assert.equal(1, category.skills.length);
                    assert.equal(_skill.name, category.skills[0].name);
                    done();
                });
            });
        });

        test('update skill name', function(done){
            Category.updateSkillName(_category._id, _skill._id, _nameForUpdate, function() {
                Category.findById(_category._id, function(category){
                    assert.equal(1, category.skills.length);
                    assert.equal(_nameForUpdate, category.skills[0].name);
                    done();
                });
            });
        });

        test('update skill grades', function(done){
            Category.updateSkillGrades(_category._id, _skill._id, [1, 3, 7], function() {
                Category.findById(_category._id, function(category){
                    assert.equal(1, category.skills.length);
                    assert.equal(3, category.skills[0].grades.length);
                    assert.equal(1, category.skills[0].grades[0]);
                    assert.equal(3, category.skills[0].grades[1]);
                    assert.equal(7, category.skills[0].grades[2]);
                    done();
                });
            });
        });

        test('update skill grades with more', function(done){
            Category.updateSkillGrades(_category._id, _skill._id, [1, 2], function() {
                Category.findById(_category._id, function(category){
                    assert.equal(1, category.skills.length);
                    assert.equal(2, category.skills[0].grades.length);
                    assert.equal(1, category.skills[0].grades[0]);
                    assert.equal(2, category.skills[0].grades[1]);
                    done();
                });
            });
        });

        test('remove a skill', function(done){
            Category.removeSkill(_category._id, _skill._id, function(skill) {
                assert.equal(_skill._id, skill._id);
                Category.findById(_category._id, function(category){
                    assert.equal(0, category.skills.length);
                    done();
                });
            });
        });
    });
});
