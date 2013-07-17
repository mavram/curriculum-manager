var assert = require("chai").assert,
    request = require('supertest'),
    config = require('../../config'),
    Model = require('../../model/model'),
    User = require('../../model/user'),
    Category = require('../../model/category'),
    middleware = require('../../middleware');


suite('API:', function () {
    suiteSetup(function (done) {
        Model.init(function () {
            User.insert({ username:'tt', email: 'tt@k12.org', password: 'n0ne', isAdmin: false }, function() {
                done();
            });
        });
    });

    suiteTeardown(function (done) {
        Model.db.dropDatabase(function () {
            Model.db.close();
            done();
        });
    });

    suite('auth:', function () {
        test('POST /signin', function (done) {
            request(middleware)
                .post('/api/v.1/auth/signin')
                .send({ username:'tt', password: 'n0ne' })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        test('GET /signout', function (done) {
            request(middleware)
                .get('/api/v.1/auth/signout')
                .expect(500, done);
        });
    });

    suite('subjects:', function () {
        test('GET /subjects', function (done) {
            request(middleware)
                .get('/api/v.1/subjects')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    suite('grades:', function () {
        test('GET /grades', function (done) {
            request(middleware)
                .get('/api/v.1/grades')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    suite('categories:', function () {
        var _category = { subject: 'Subject', name: 'Name'};

        test('GET /categories', function (done) {
            request(middleware)
                .get('/api/v.1/categories')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        test('POST /categories', function (done) {
            request(middleware)
                .post('/api/v.1/categories')
                .send(_category)
                .expect(200, /"subject":"Subject","name":"Name","_id":"/,done);
        });
        test('PUT /categories', function (done) {
            Category.insert(_category, function(categories) {
                _category._id = categories[0]._id;
                request(middleware)
                    .put('/api/v.1/categories/' + _category._id)
                    .send({name: 'UpdatedName'})
                    .expect(200, "OK",done);
            });
        });
        test('POST /categories/skills', function (done) {
            request(middleware)
                .post('/api/v.1/categories/' + _category._id + '/skills')
                .send({name: 'SkillName'})
                .expect(200, /"name":"SkillName","_id":"/,done);
        });
        test('PUT /categories/skills', function (done) {
            Category.findById(_category._id, function(category){
                assert.equal(1, category.skills.length);
                _category.skills = category.skills;
                request(middleware)
                    .put('/api/v.1/categories/' + _category._id + '/skills/' + _category.skills[0]._id)
                    .send({name: 'UpdatedSkillName'})
                    .expect(200, "OK",done);
            });
        });
        test('DEL /categories/skills', function (done) {
            request(middleware)
                .del('/api/v.1/categories/' + _category._id + '/skills/' + _category.skills[0]._id)
                .expect(200, JSON.stringify({_id: _category.skills[0]._id}), done);
        });
        test('DEL /categories', function (done) {
            request(middleware)
                .del('/api/v.1/categories/' + _category._id)
                .expect(200, JSON.stringify({_id: _category._id}), done);
        });
    });
});
