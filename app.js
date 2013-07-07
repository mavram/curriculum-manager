/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes/routes')
    , http = require('http')
    , utils = require('./utils')
    , path = require('path')
    , passport = require('passport')
    , PassportStrategy = require('passport-local').Strategy
    , PersistentPassportStrategy = require('passport-remember-me').Strategy;


/*
 * Authentication
 */

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com', isAdmin: false },
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com', isAdmin: false  },
    { id: 3, username: 'hekademos', password: 'think4me', email: 'hekademos@example.com', isAdmin: true  }
];

var findById = function(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

var findByUsername = function (username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

var tokens = {}

var consumeToken = function(token, fn) {
    var uid = tokens[token];
    // invalidate the single-use token
    delete tokens[token];
    return fn(null, uid);
}

var saveToken = function(token, uid, fn) {
    tokens[token] = uid;
    return fn();
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use(new PassportStrategy(function (username, password, done) {
    findByUsername(username, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (user.password != password) {
            return done(null, false);
        }
        return done(null, user);
    })
}));


var REMEMBER_ME_TOKEN = 'uid';


passport.use(new PersistentPassportStrategy(
    {key: REMEMBER_ME_TOKEN},
    function (token, done) {
        consumeToken(token, function (err, uid) {
            if (err) {
                return done(err);
            }
            if (!uid) {
                return done(null, false);
            }

            findById(uid, function (err, user) {
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
    createToken
));


function createToken(user, done) {
    var token = utils.getRandomString(256);
    saveToken(token, user.id, function (err) {
        if (err) {
            return done(err);
        }
        return done(null, token);
    });
};


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


var app = express();

// all environments
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser('___9876543210__'));
app.use(express.methodOverride());
app.use(express.session({ secret: '___9876543210__' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/logout', function(req, res) {
    res.clearCookie(REMEMBER_ME_TOKEN);
    req.logout();
    res.redirect('/');
});
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }

            if (!req.body.rememberMe) {
                return res.redirect('/');
            }

            createToken(req.user, function (err, token) {
                if (err) {
                    return next(err);
                }
                res.cookie(REMEMBER_ME_TOKEN, token, { path: '/', httpOnly: true, maxAge: 30*24*60*60*1000/* 28 days*/ });
                return res.redirect('/');
            });
        });
    })(req, res, next);
});
app.get('*', function (req, res, next) {
    routes.errorPage(404, 'Page Not Found.', req, res);
});
app.use(function(err, req, res, next) {
    console.log(err.message);
    routes.errorPage(500, 'Internal Server Error', req, res);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Application started. <' + app.get('env') + ':' + app.get('port') + '>');
});




