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
 * Initialize the application
 */

logger.info("Connecting to the db...");

Model.init(function () {
    logger.info('Successfully connected to ' + Model.cfg.name);

    User.findAll(function (users) {
        if (users.length > 0) {
            logger.info(users.length + ' users');
        } else {
            var errorHandler =  function (result) {
                // success
            };

            User.insert({ firstname: 'Mircea', lastname: 'Avram', email: 'ma@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ firstname: 'Azhar', lastname: 'Kazmi', email: 'ak@k12.org', password: 'w0rd', isAdmin: true }, errorHandler);
            User.insert({ firstname: 'Zoe', lastname: 'Zimmer', email: 'zz@k12.org', password: 'n0ne', grade: 3 }, errorHandler);

            Category.init();

            Category.insert({ subject: 'Math', name: 'Addition', skills: [{ name: 'Addition with zero' }, { name: 'Addition with 1-digit' }] }, errorHandler);
            Category.insert({ subject: 'Math', name: 'Substraction', skills: [{ name: 'Substraction up to 10'}, { name: 'Substraction up to 50' }]}, errorHandler);
            Category.insert({ subject: 'Math', name: 'Multiplication', skills: [{ name: 'Multiplication with 10'}]}, errorHandler);
            Category.insert({ subject: 'Math', name: 'Division', skills: [{ name: 'Division with onw digit numbers'}, { name: 'Division with 2 digit numbers' }, { name: 'Long division' }]}, errorHandler);
            Category.insert({ subject: 'Science', name: 'Mechanics', skills: [{ name: 'Forces' }, { name: 'Acceleration' }] }, errorHandler);
            Category.insert({ subject: 'Science', name: 'Natural Science', skills: [{ name: 'Weather'}]}, errorHandler);

        }
    });

    logger.info('Starting the HTTP server...');

    // Start the server
    var server = http.createServer(app).listen(app.get('port'), function () {
        logger.info('Server started listening on ' + app.get('port'));
    });


    function _terminate() {
        // TODO: close db connection gracefully
        Model.db.close();
        server.close();
    }

    // catch-all exceptions
    process.on('uncaughtException', function(err) {
        logger.fatal(err.stack);
        _terminate();
        process.exit(-1);
    });

    // Default kill signal
    process.on('SIGTERM', function() {
        _terminate();
        logger.info('Terminated');
        process.exit();
    });

    // CTRL+c
    process.on('SIGINT', function() {
        _terminate();
        logger.info('Terminated from console');
        process.exit();
    });
});
