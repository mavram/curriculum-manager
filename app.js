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
            console.log('ERR: Failed to get the users. ' + err);
        } else if (users.length > 0) {
            console.log('DEBUG: ' + users.length + ' users.');
        } else {
            setup._createUsers(function (err) {
                if (err) {
                    console.log('ERR: Failed to create users.' + err);
                }
            });
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
