/**
 * Main application
 */

var http = require('http'),
    fs = require('fs'),
    app = require('./middleware'),
    config = require('./config'),
    logger = require('./logger'),
    Model = require('./model/model'),
    User = require('./model/user');


logger.level = config.get('log:level');
logger.info('Loaded ' + process.env.NODE_ENV + ' environment configuration.');


/*
 * Catch-all Exceptions Handler
 */
process.on('uncaughtException', function(err) {
    logger.fatal(err.stack);
    process.exit(-1);
});


/*
 * Initialize the application
 */

logger.info("Connecting to the model...");

Model.init(function () {
    logger.info('Successfully connected to the model ' + Model.dbName);

    User.findAll(function (users) {
        if (users.length > 0) {
            logger.info(users.length + ' users.');
        } else {
            var errorHandler =  function (users) {
                // success
            };

            User.insert({ username:'ma', email: 'ma@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'ak', email: 'ak@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'aa', email: 'aa@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'zz', email: 'zz@k12.org', password: 'n0ne', isAdmin: false }, errorHandler);

            // dummy categories
            //Category.createDummyCategories();
        }
    });

    logger.info('Starting the HTTP server on ' + app.get('port') + '...');

    // Start the server
    http.createServer(app).listen(app.get('port'), function () {
        logger.info('Server started listening on ' + app.get('port') + '.');
    });
});
