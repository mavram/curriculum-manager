/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , flash = require('connect-flash')
    , passport = require('passport')
    , PassportStrategy = require('passport-local').Strategy
    , PersistentPassportStrategy = require('passport-remember-me').Strategy
    , mongoose = require('mongoose')
    , UserModel = require('./models/user')
    , TokenModel = require('./models/token')
    , API = require('./api');


/*
 * Database connect
 */
var dbPath = process.env.DB_PATH || 'mongodb://localhost/db';
var dbOptions = { db: { safe: true }};

mongoose.connect(dbPath, dbOptions, function (err, res) {
    if (err) {
        console.log ('Failed to connect to: ' + dbPath + '. ' + err);
    } else {
        console.log ('Successfully connected to: ' + dbPath);

//        UserModel.createUser('bob', 'bob@gmail.com', 'bob', false, function (err, users) {
//            if (err) {
//                console.log('Failed to create user.' + err);
//            } else {
//                console.log(users);
//            }
//        });

        UserModel.findUsers(function (err, users) {
            if (Array.isArray(users)) {
                if (users.length > 0) {
                    console.log(users.length + ' registered users.');
                    return;
                }
            }
            UserModel.createUser('hekademos', 'hekademos@gmail.com', 'think4me', true, function (err, users) {
                if (err) {
                    console.log('Failed to create user.' + err);
                }
            });
        });
    }
});


/*
 * Authentication
 */

var REMEMBER_ME_TOKEN = 'uid';

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function (err, user) {
        if (!user) {
            console.log('No user with id: ' + id);
        } else if (err) {
            console.log('Failed to find user with id: ' + id + '. ' + err);
        }
        done(err, user);
    });
});

passport.use(new PassportStrategy(function (username, password, done) {
    UserModel.findByUsername(username, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'Unknown username.'});
        }
        if (user.password != password) {
            return done(null, false, {message: 'Invalid password.'});
        }
        return done(null, user);
    })
}));

passport.use(new PersistentPassportStrategy(
    {key: REMEMBER_ME_TOKEN},
    function (token, done) { // consume token
        TokenModel.consumeToken(token, function(err, token){
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }
            if (!token.uid) {
                return done(null, false);
            }

            console.log('Token ' + token.id + ' consumed by ' + token.uid);

            UserModel.findById(token.uid, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });
    },
    function (user, done) { // issue token
        TokenModel.createToken(user.id, function(err, token) {
            if (err) {
                return done(err);
            }
            console.log('Token ' + token.id + ' generated for ' + user.id);
            return done(null, token.id);
        });
    }));

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
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(express.logger('tiny'));
app.use(express.static(path.join(__dirname, 'public')));


/*
* Routing
*/
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/logout', function(req, res) {
    TokenModel.consumeTokenForUser(req.user.id, function(err, token){
        if (err) {
            return done(err);
        }

        console.log('Token ' + token.id + ' consumed (logout) by ' + token.uid);
        res.clearCookie(REMEMBER_ME_TOKEN);

        req.logout();
        res.redirect('/');
    });
});
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.login(user, function (err) {

            if (err) {
                return next(err);
            }

            if (!req.body.rememberMe) {
                return res.redirect('/');
            }

            TokenModel.createToken(req.user.id, function (err, token) {
                if (err) {
                    return next(err);
                }

                console.log('Token ' + token.id + ' generated (login) for ' + user.id);
                res.cookie(REMEMBER_ME_TOKEN, token.id, { path: '/', httpOnly: true, maxAge: 30*24*60*60*1000/* 28 days*/ });

                return res.redirect('/');
            });
        });
    })(req, res, next);
});


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
    console.log(err.message);
    routes.errorPage(500, 'Internal Server Error', req, res);
});


/*
* The server
*/
http.createServer(app).listen(app.get('port'), function () {
    console.log('Application started. <' + app.get('env') + ':' + app.get('port') + '>');
});


/*
* Unhandled exceptions
*/
process.on('uncaughtException', function(err) {
    console.log('FATAL ERROR: ' + err.message);
    process.exit(-1);
});


