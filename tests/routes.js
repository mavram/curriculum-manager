var assert = require('chai').assert
    ,pages = require('../routes');

suite('routes', function () {

    test("index page is defined", function () {
        assert.isDefined(routes.index);
    });

    test("login page is defined", function () {
        assert.isDefined(routes.login);
    });

    test("error page is defined", function () {
        assert.isDefined(routes.errorPage);
    });

})