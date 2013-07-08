/**
 * Main application
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , auth = require('./auth')
    , flash = require('connect-flash')
    , mongoose = require('mongoose')
    , User = require('./models/user')
    , Curriculum = require('./models/curriculum')
    , API = require('./api')
    , setup = require('./setup');


/*
 * Unhandled exceptions
 */
if (process.env.DB_PATH) {
    process.on('uncaughtException', function(err) {
        console.log('FATAL: Unhandled exception. ' + err.message);
        process.exit(-1);
    });
}


/*
 * Middleware security helpers
 */
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

var ensureAdmin = function (req, res, next) {
    if (req.user && req.user.isAdmin === true) {
        next();
    } else  {
        routes.errorPage(403, 'Not Authorized.', req, res);
    }
}


/*
 * Middleware
 */
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser('___9876543210__'));
app.use(express.methodOverride());
app.use(express.session({ secret: '___9876543210__' }));
app.use(flash());
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.use(auth.passport.authenticate('remember-me'));
app.use(express.logger('tiny'));
app.use(express.static(path.join(__dirname, 'public')));


/*
 * Routing
 */
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/logout', auth.logout);
app.post('/login', auth.loginByPost);


/*
 * User API
 */
app.get('/api/v.1/user/accountSettings', ensureAuthenticated, API.accountSettings);


/*
 * Catch all and error handling
 */
app.get('*', function (req, res, next) {
    routes.errorPage(404, 'Page Not Found.', req, res);
});
app.use(function(err, req, res, next) {
    console.log('ERR: Middleware Error. ' + err.message);
    routes.errorPage(500, 'Internal Server Error', req, res);
});


/*
 * Database connect
 */
var dbPath = process.env.DB_PATH || 'mongodb://localhost/db';
var dbOptions = { db: { safe: true }};


mongoose.connection.on('open', function() {
    // Start the server
    http.createServer(app).listen(app.get('port'), function () {
        console.log('INFO: Application started in ' + app.get('env') + ' on port ' + app.get('port') + '.');
    });
});

console.log("INFO: Connecting to: " + dbPath);

mongoose.connect(dbPath, dbOptions, function (err, res) {
    if (err) {
        console.log ('ERR: Failed to connect to: ' + dbPath + '. ' + err);
    } else {
        console.log ('INFO: Successfully connected to: ' + dbPath);

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
        Curriculum.find(function (err, curriculums) {
            if (err) {
                console.log('ERR: Failed to get the curriculums. ' + err);
            } else if (curriculums.length > 0) {
                console.log('DEBUG: ' + curriculums.length + ' curriculums.');
            } else {
                setup._createCurriculums(function (err) {
                    if (err) {
                        console.log('ERR: Failed to create curriculums.' + err);
                    }
                });
            }

        });
    }
});
