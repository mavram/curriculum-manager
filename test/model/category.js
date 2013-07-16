var assert = require("chai").assert;

var mongo = require('mongodb'),
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

        test('should insert category', function(done){
            Category.insert(_category, function(categories) {
                assert.equal(_category.name, categories[0].name);
                _category._id = categories[0]._id;
                done();
            });
        });

        test('should find all categories', function(done){
            Category.findAll(function(categories) {
                assert.equal(1, categories.length);
                assert.equal(_category.name, categories[0].name);
                done();
            });
        });

        test('should remove category', function(done){
            Category.remove(_category._id, function(category) {
                assert.equal(_category._id, category._id);
                done();
            });
        });

        test('should not remove inexistent category', function(done){
            Category.remove(_category._id, function(category) {
                assert.equal(undefined, category._id);
                done();
            });
        });
    });
});
