/**
 * Authentication methods
 */

var passport = require('passport')
    , PassportStrategy = require('passport-local').Strategy
    , PersistentPassportStrategy = require('passport-remember-me').Strategy
    , UserModel = require('./models/user')
    , TokenModel = require('./models/token');


var REMEMBER_ME_TOKEN = 'uid';

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        if (!user) {
            console.log('WARN: No user with id: ' + id);
        } else if (err) {
            console.log('ERR: Failed to find user with id: ' + id + '. ' + err);
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

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log('WARN: Failed to match the password.');
                return done(err);
            } else if (!isMatch) {
                return done(null, false, {message: 'Invalid password.'});
            } else {
                return done(null, user);
            }
        });
    });
}));

passport.use(new PersistentPassportStrategy(
    {key: REMEMBER_ME_TOKEN},
    function (token, done) { // consume token
        TokenModel.consumeToken(token, function (err, token) {
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }
            if (!token.uid) {
                return done(null, false);
            }

            console.log('DEBUG: Token ' + token.id + ' consumed by ' + token.uid);

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
        TokenModel.createToken(user.id, function (err, token) {
            if (err) {
                return done(err);
            }
            console.log('DEBUG: Token ' + token.id + ' issued for ' + user.id);
            return done(null, token.id);
        });
    }));


/*
 * Routes
 */
exports.logout = function (req, res) {
    TokenModel.consumeTokenForUser(req.user.id, function (err, token) {
        if (err) {
            return done(err);
        }

        console.log('DEBUG: Token ' + token.id + ' at logout by ' + token.uid);
        res.clearCookie(REMEMBER_ME_TOKEN);

        req.logout();
        res.redirect('/');
    });
};

exports.loginByPost = function (req, res, next) {
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

                console.log('DEBUG: Token ' + token.id + ' at login for ' + user.id);
                res.cookie(
                    REMEMBER_ME_TOKEN,
                    token.id,
                    { path: '/', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000/* 28 days*/ });

                return res.redirect('/');
            });
        });
    })(req, res, next);
};

exports.passport = passport;
