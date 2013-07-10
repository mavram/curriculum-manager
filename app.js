/**
 * Main application
 */

var mongoose = require('mongoose')
    , http = require('http')
    , app = require('./middleware')
    , config = require('./config')
    , logger = require('./logger')
    , setup = require('./setup')
    , User = require('./models/user')
    , Curriculum = require('./models/curriculum')
    , Subject = require('./models/subject');



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

    // Bootrstrap the app
    User.find(function (err, users) {
        if (err) {
            logger.log('error', 'Failed to get the users. ' + err.message);
        } else if (users.length > 0) {
            logger.log('info', users.length + ' users.');
        } else {
            var errorHandler =  function (err, user) {
                if (err) {
                    logger.log('error', 'Failed to create user. ' + err.message);
                }
            };

            User.create('ma', 'ma@akademeia.org', 'think4me', true, errorHandler);
            User.create('ak', 'ak@akademeia.org', 'think4u', true, errorHandler);
            User.create('aa', 'aa@akademeia.org', 'passw0rd', true, errorHandler);
            User.create('zz', 'zz@akademeia.org', 'n0ne', false, errorHandler);
            User.create('akademos', 'akademos@akademeia.org', 'n0ne', false, errorHandler);
        }
    });
    Curriculum.find(function (err, curricula) {
        if (err) {
            console.log('ERR: Failed to get the curricula. ' + err);
        } else if (curricula.length > 0) {
            console.log('DEBUG: ' + curricula.length + ' curricula.');
        } else {
            setup._createCurricula(function (err) {
                if (err) {
                    console.log('ERR: Failed to create curricula.' + err);
                }
            });
        }
    });
    Subject.find(function (err, subjects) {
        if (err) {
            console.log('ERR: Failed to get the subjects. ' + err);
        } else if (subjects.length > 0) {
            console.log('DEBUG: ' + subjects.length + ' subjects.');
        } else {
            setup._createSubjects(function (err) {
                if (err) {
                    console.log('ERR: Failed to create subjects.' + err);
                }
            });
        }
    });
});
