/**
 * Main application
 */

var mongoose = require('mongoose')
    , http = require('http')
    , fs = require('fs')
    , assert = require('assert')
    , app = require('./middleware')
    , config = require('./config')
    , logger = require('./logger')
    , User = require('./models/user')
    , Hierarchy = require('./models/hierarchy');



logger.level = config.get('log:level');

logger.log('info', 'Loaded ' + config.get('env') + ' environment configuration.')

/*
 * Catch-all Exceptions Handler
 */
process.on('uncaughtException', function(err) {
    logger.log('fatal', err.stack);
    process.exit(-1);
});


/*
 * Database connection
 */
var dbPath = 'mongodb://' + config.get('database:host') + '/' + config.get('database:name');
var dbOptions = { db: { safe: true }};

mongoose.connection.on('open', function() {
    logger.log ('info', 'Starting the HTTP server on ' + app.get('port'));

    // Start the server
    http.createServer(app).listen(app.get('port'), function () {
        logger.log('info', 'Server started listening on ' + app.get('port') + '.');
    });
});

logger.log('info', "Connecting to the database " + dbPath);

mongoose.connect(dbPath, dbOptions, function (err, res) {
    if (err) {
        throw new Error('Failed to connect to the database ' + dbPath + '. ' + err);
    }

    logger.log ('info', 'Successfully connected to the database ' + dbPath);

    // Init the database (if needed)
    User.findAll(function (users) {
        if (users.length > 0) {
            logger.log('info', users.length + ' users.');

            // default hierarchy
            Hierarchy.loadFromFile('./models/hierarchy.json');
        } else {
            var errorHandler =  function (err, user) {
                if (err) {
                    logger.log('error', 'Failed to create user. ' + err.message);
                }
            };
            User.create('ma', 'ma@k12.org', 'think4me', true, errorHandler);
            User.create('ak', 'ak@k12.org', 'think4u', true, errorHandler);
            User.create('aa', 'aa@k12.org', 'passw0rd', true, errorHandler);
            User.create('zz', 'zz@k12.org', 'n0ne', false, errorHandler);

            // default hierarchy
            Hierarchy.loadFromFile('./models/hierarchy.json');
        }
    });
});
