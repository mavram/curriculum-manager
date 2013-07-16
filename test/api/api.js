var assert = require("chai").assert,
    request = require('supertest'),
    config = require('../../config'),
    Model = require('../../model/model'),
    User = require('../../model/user'),
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

//    app.post('/api/v.1/categories', ensureAdmin, api.addCategory);
//    app.delete('/api/v.1/categories/:id', ensureAdmin, api.removeCategory);
//    app.post('/api/v.1/categories/:categoryId/skills', ensureAdmin, api.addSkill);
//    app.delete('/api/v.1/categories/:categoryId/skills/:id', ensureAdmin, api.removeSkill);

    suite('categories:', function () {
        var _category = { subject: 'Subject', name: 'Name' };

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
//        test('DELETE /categories/:id', function (done) {
//            request(middleware)
//                .get('/api/v.1/categories/:id')
//                .set({id : })
//                .expect('Content-Type', /json/)
//                .expect(200, done);
//        });
    });
});
