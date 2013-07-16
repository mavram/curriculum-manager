var assert = require("chai").assert,
    request = require('supertest'),
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
                .expect(401, '401 - Unauthorized', done);
        });
    });

    suite('categories:', function () {
        test('GET /categories', function (done) {
            request(middleware)
                .get('/api/v.1/categories')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
