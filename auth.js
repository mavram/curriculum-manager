/**
 * Authentication code
 */

var passport = require('passport'),
    LocalPassportStrategy = require('passport-local').Strategy,
    RememberMePassportStrategy = require('passport-remember-me').Strategy,
    logger = require('./logger'),
    User = require('./models/user'),
    Token = require('./models/token'),
    API = require('./api');


var REMEMBER_ME_COOKIE = '_k12_remember_me';

passport.serializeUser(function (user, next) {
    next(null, user._id);
});

passport.deserializeUser(function (id, next) {
    User.findById(id, function (user) {
        if (!user) {
            logger.log('warn', 'No user with id ' + id);
        }
        next(null, user);
    });
});

passport.use(new LocalPassportStrategy(function (username, password, next) {
    User.findByName(username, function (user) {
        if (!user) {
            next(null, false, {message: 'Unknown username.'});
        } else {
            User.comparePassword(user.password, password, function (isMatch) {
                if (!isMatch) {
                    next(null, false, {message: 'Invalid password.'});
                } else {
                    next(null, user);
                }
            });
        }
    });
}));

passport.use(new RememberMePassportStrategy(
    {key: REMEMBER_ME_COOKIE},
    function (id, next) { // consume token
        Token.consume(id, function (token) {
            if (token) {
                logger.log('debug', 'Token ' + token._id + ' consumed by ' + token.uid);
                return User.findById(token.uid, function (user) {
                    return next(null, user);
                });
            } else {
                logger.log('warn', 'Failed to find token ' + id);
                return next(null, false);
            }
        });
    },
    function (user, next) { // issue token
        Token.issue({ uid: user._id }, function (err, token) {
            if (err) {
                logger.log('err', 'Failed to save token for user '+ user._id);
                return next(err);
            }
            logger.log('debug', 'Token ' + token._id + ' issued for ' + user._id);
            return next(null, token._id);
        });
    }));


/*
 * API
 */
exports.signout = function (req, res) {
    var _logout = function () {
        logger.log('debug', 'User signed out ' + req.user._id);
        req.logout();
        API.sendResult(res, 'OK');
    };

    var tokenId = req.cookies[REMEMBER_ME_COOKIE];
    if (tokenId) {
        Token.consume(tokenId, function (token) {
            if (token) {
                logger.log('debug', 'Token ' + token._id + ' consumed at logout by ' + token.uid);
                res.clearCookie(REMEMBER_ME_COOKIE);
            }
            _logout();
        });
    } else {
        _logout();
    }
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
        return req.login(user, function (err) {
            if (err) {
                logger.log('error', 'Failed to login user ' + user._id);
                return next(err);
            }

            var success = function() {
                logger.log('debug', 'User signed in ' + user._id);
                API.sendResult(res, JSON.stringify(User.asUserProfile(user)));
            };

            if (!req.body.rememberMe) {
                return success();
            }

            return Token.issue({ uid: user._id }, function (err, token) {
                if (err) {
                    logger.log('error', 'Failed to save token for user ' + user._id);
                    return next(err);
                }

                logger.log('debug', 'Token ' + token._id + ' issued at login for ' + user._id);
                res.cookie(
                    REMEMBER_ME_COOKIE,
                    token._id,
                    { path: '/', httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000/* 28 days*/ });

                return success();
            });
        });
    })(req, res, next);
};

exports.passport = passport;
