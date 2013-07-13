/**
 * Authentication code
 */

var passport = require('passport')
    , LocalPassportStrategy = require('passport-local').Strategy
    , RememberMePassportStrategy = require('passport-remember-me').Strategy
    , logger = require('./logger')
    , User = require('./models/user')
    , Token = require('./models/token')
    , API = require('./api');


var REMEMBER_ME_COOKIE = '_k12_remember_me';

passport.serializeUser(function (user, next) {
    next(null, user.id);
});

passport.deserializeUser(function (id, next) {
    User.findUnique(id, function (user) {
        if (!user) {
            logger.log('warn', 'No user with id ' + id);
        }
        next(null, user);
    });
});

passport.use(new LocalPassportStrategy(function (username, password, next) {
    User.findByName(username, function (user) {
        if (!user) {
            return next(null, false, {message: 'Unknown username.'});
        }
        user.comparePassword(password, function (isMatch) {
            if (!isMatch) {
                return next(null, false, {message: 'Invalid password.'});
            } else {
                return next(null, user);
            }
        });
    });
}));

passport.use(new RememberMePassportStrategy(
    {key: REMEMBER_ME_COOKIE},
    function (id, next) { // consume token
        Token.consume(id, function (token) {
            if (token) {
                logger.log('debug', 'Token ' + token.id + ' consumed by ' + token.uid);
                User.findUnique(token.uid, function (user) {
                    return next(null, user);
                });
            } else {
                logger.log('warn', 'Failed to find token ' + id);
                return next(null, false);
            }
        });
    },
    function (user, next) { // issue token
        Token.issue(user.id, function (err, token) {
            if (err) {
                logger.log('err', 'Failed to save token for user '+ user.id);
                return next(err);
            }
            logger.log('debug', 'Token ' + token.id + ' issued for ' + user.id);
            return next(null, token.id);
        });
    }));


/*
 * API
 */
exports.signout = function (req, res) {
    Token.consumeForUser(req.user.id, function (token) {
        if (token) {
            logger.log('debug', 'Token ' + token.id + ' consumed at logout by ' + token.uid);
            res.clearCookie(REMEMBER_ME_COOKIE);
        }
        req.logout();
        API.sendResult(res, 'OK');
    });
};

exports.signin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            logger.log('err', 'Failed to authenticate. ' + err.message);
            return next(err);
        }
        if (!user) {
            return API.sendError(res, info.message);
        }
        req.login(user, function (err) {
            if (err) {
                logger.log('error', 'Failed to login user ' + user.id);
                return next(err);
            }

            var success = function() {
                API.sendResult(res, JSON.stringify(user.asUserProfile()));
            }

            if (!req.body.rememberMe) {
                return success();
            }

            Token.issue(user.id, function (err, token) {
                if (err) {
                    logger.log('error', 'Failed to save token for user ' + user.id);
                    return next(err);
                }

                logger.log('debug', 'Token ' + token.id + ' issued at login for ' + user.id);
                res.cookie(
                    REMEMBER_ME_COOKIE,
                    token.id,
                    { path: '/', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000/* 28 days*/ });

                return success();
            });
        });
    })(req, res, next);
};

exports.passport = passport;
