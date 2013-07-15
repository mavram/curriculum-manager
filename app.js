/**
 * Main application
 */

var http = require('http'),
    fs = require('fs'),
    app = require('./middleware'),
    config = require('./config'),
    logger = require('./logger'),
    Model = require('./models/model'),
    User = require('./models/user');


logger.level = config.get('log:level');
logger.log('info', 'Loaded ' + config.get('env') + ' environment configuration.');


/*
 * Catch-all Exceptions Handler
 */
process.on('uncaughtException', function(err) {
    logger.log('fatal', err.stack);
    process.exit(-1);
});


/*
 * Initialize the model
 */

logger.log('info', "Connecting to the model...");

Model.init(function () {
    logger.log ('info', 'Successfully connected to the model ' + Model.name);

    User.findAll(function (users) {
        if (users.length > 0) {
            logger.log('info', users.length + ' users.');
        } else {
            var errorHandler =  function (err, user) {
                if (err) {
                    logger.log('error', 'Failed to create user. ' + err.message);
                }
            };

            User.insert({ username:'ma', email: 'ma@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'ak', email: 'ak@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'aa', email: 'aa@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'zz', email: 'zz@k12.org', password: 'n0ne', isAdmin: false }, errorHandler);

            // dummy categories
            //Category.createDummyCategories();
        }
    });

    logger.log ('info', 'Starting the HTTP server on ' + app.get('port') + '...');

    // Start the server
    http.createServer(app).listen(app.get('port'), function () {
        logger.log('info', 'Server started listening on ' + app.get('port') + '.');
    });
});
