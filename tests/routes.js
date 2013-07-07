var assert = require('chai').assert
    ,pages = require('../routes/routes');

suite('routes', function () {

    test("index page is defined", function () {
        assert.isDefined(routes.index);
    });

    test("error page is defined", function () {
        assert.isDefined(routes.errorPage);
    });

})