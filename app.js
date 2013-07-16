/**
 * Main application
 */

var http = require('http'),
    fs = require('fs'),
    config = require('./config'),
    app = require('./middleware'),
    logger = require('./logger'),
    Model = require('./model/model'),
    User = require('./model/user'),
    Category = require('./model/category');


/*
 * Catch-all Exceptions Handler
 */
process.on('uncaughtException', function(err) {
    Model.db.close();
    logger.fatal(err.stack);
    process.exit(-1);
});


// TODO: close db connection gracefully


/*
 * Initialize the application
 */

logger.info("Connecting to the model...");

Model.init(function () {
    logger.info('Successfully connected to the model ' + Model.cfg.name);

    User.findAll(function (users) {
        if (users.length > 0) {
            logger.info(users.length + ' users.');
        } else {
            var errorHandler =  function (result) {
                // success
            };

            User.insert({ username:'ma', email: 'ma@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'ak', email: 'ak@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'aa', email: 'aa@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ username:'zz', email: 'zz@k12.org', password: 'n0ne', isAdmin: false }, errorHandler);

            Category.insert({ subject: 'Math', name: 'Addition', skills: [{ name: 'Addition with zero' }, { name: 'Addition with 1-digit' }] }, errorHandler);
            Category.insert({ subject: 'Math', name: 'Substraction', skills: [{ name: 'Substraction up to 10'}, { name: 'Substraction up to 50' }]}, errorHandler);
            Category.insert({ subject: 'Math', name: 'Multiplication', skills: [{ name: 'Multiplication with 10'}]}, errorHandler);
            Category.insert({ subject: 'Math', name: 'Division', skills: [{ name: 'Division with onw digit numbers'}, { name: 'Division with 2 digit numbers' }, { name: 'Long division' }]}, errorHandler);
            Category.insert({ subject: 'Science', name: 'Mechanics', skills: [{ name: 'Forces' }, { name: 'Acceleration' }] }, errorHandler);
            Category.insert({ subject: 'Science', name: 'Natural Science', skills: [{ name: 'Weather'}]}, errorHandler);

        }
    });

    logger.info('Starting the HTTP server on ' + app.get('port') + '...');

    // Start the server
    http.createServer(app).listen(app.get('port'), function () {
        logger.info('Server started listening on ' + app.get('port') + '.');
    });
});
