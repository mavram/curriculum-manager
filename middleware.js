/*
 * Middleware
 */

var express = require('express'),
    ejs = require('ejs'),
    http = require('http'),
    path = require('path'),
    auth = require('./auth'),
    config = require('./config'),
    api = require('./api'),
    logger = require('./logger'),
    User = require('./model/user');


/*
 * Errors helper
 */

var sendError = function (res, status){
    res.status(status);
    res.end(status + ' - ' + http.STATUS_CODES[status]);
};

/*
 * Security helpers
 */
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated() || config.isTestEnv()) {
        return next();
    }
    return sendError(res, 401);
};

var ensureAdmin = function (req, res, next) {
    if ((req.user && req.user.isAdmin === true) || config.isTestEnv()) {
        next();
    } else  {
        sendError(res, 403);
    }
};


var app = express();

/*
 * Configuration
 */
app.set('port', config.get('port'));
app.set('env', config.get('env'));

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', __dirname + '/views');

if (!config.isTestEnv() ) {
    app.use(express.logger('tiny'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('___9876543210__'));
app.use(express.cookieParser('___9876543210__'));
app.use(express.session({ secret: '___9876543210__' }));
// TODO: enable cookieSession
//app.use(express.cookieSession({ key: '_k12_session', secret: '___9876543210__', cookie: { maxAge: 3 * 60 * 60 * 1000 }}));
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.use(auth.passport.authenticate('remember-me'));

/*
 * API v.1
 */
app.post('/api/v.1/auth/signin', auth.signin);
app.get('/api/v.1/auth/signout', ensureAuthenticated, auth.signout);

app.post('/api/v.1/user', api.createUser);
app.get('/api/v.1/user/settings', ensureAuthenticated, api.settings);

app.get('/api/v.1/subjects', api.subjects);
app.get('/api/v.1/grades', api.grades);

app.get('/api/v.1/categories', api.categories);
app.post('/api/v.1/categories', ensureAdmin, api.addCategory);
app.put('/api/v.1/categories/:id', ensureAdmin, api.updateCategory);
app.delete('/api/v.1/categories/:id', ensureAdmin, api.removeCategory);
app.post('/api/v.1/categories/:categoryId/skills', ensureAdmin, api.addSkill);
app.put('/api/v.1/categories/:categoryId/skills/:id', ensureAdmin, api.updateSkill);
app.put('/api/v.1/categories/:categoryId/skills/:id/grades', ensureAdmin, api.updateSkillGrades);
app.delete('/api/v.1/categories/:categoryId/skills/:id', ensureAdmin, api.removeSkill);
app.get('/api/v.1/categories/:grade/:subject', api.categoriesByGradeAndSubject);
/*
 * Route to Angular Router
 */
app.get('/*', function (req, res) {
    // send user profile if user was persisted
    if (req.user) {
        logger.info('Session started for user ' + req.user.username + ' from ' + req.ip);
        res.cookie('_k12_user', JSON.stringify(User.asUserProfile(req.user)));
    } else {
        logger.info('Session started for anonymous from ' + req.ip);
    }

    res.render('index', {isProduction: config.isProductionEnv()});
});
app.use(function(err, req, res, next) {
    logger.error(err.stack);
    sendError(res, 500);
    next();
});

module.exports = exports = app;