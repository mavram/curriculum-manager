var assert = require('chai').assert
    ,pages = require('../routes/routes');

suite('routes', function () {

    test("index page is defined", function () {
        assert.isDefined(routes.index);
    });

    test("about page is defined", function () {
        assert.isDefined(routes.about);
    });

    test("login page is defined", function () {
        assert.isDefined(routes.login);
    });

})