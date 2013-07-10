/*
 * Middleware
 */

var express = require('express')
    , ejs = require('ejs')
    , http = require('http')
    , path = require('path')
    , flash = require('connect-flash')
    , auth = require('./auth')
    , config = require('./config')
    , api = require('./api')
    , logger = require('./logger');


/*
 * Page rendering
 */
var renderWithLayout = function (req, res, page, options){
    if (typeof(options) === 'undefined') {
        options = {};
    }

    res.render(page, options, function(err, html){
        res.render('layout', {
            body:html,
            user:req.user
        });
    });
}

var renderErrorPage = function (status, req, res) {
    res.status(status);
    renderWithLayout(req, res, 'error', {message: status + ' - ' + http.STATUS_CODES[status]});
}
/*
 * Security helpers
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


var app = express();

/*
 * Configuration
 */
app.engine('html', ejs.renderFile);
app.set('port', config.get('port'));
app.set('env', config.get('env'));
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
app.get('/', function(req, res){
    renderWithLayout(req, res, 'index');
});
app.get('/login', function(req, res){
    renderWithLayout(req, res, 'login', {message:req.flash('error')});
});
app.get('/logout', auth.logout);
app.post('/login', auth.loginByPost);
/*
 * api
 */
app.get('/api/v.1/user/accountSettings', ensureAuthenticated, api.accountSettings);
app.get('/api/v.1/hierarchy/curricula', api.curricula);
app.get('/api/v.1/hierarchy/subjects', api.subjects);
app.get('/api/v.1/hierarchy/categories', api.categories);
app.get('/api/v.1/hierarchy/skills', api.skills);
/*
 * Error handling
 */
app.get('*', function (req, res, next) {
    renderErrorPage(404, req, res);
});
app.use(function(err, req, res, next) {
    logger.log('error', err.message);
    renderErrorPage(500, req, res);
});

module.exports = exports = app;