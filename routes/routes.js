/*
 *  Main routes
 */


/**
 * Render partial routes with a default layout
 *
 * @param req request
 * @param res response
 * @param page partial page
 * @param options render options/variable
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
};


/*
 * GET /index
 */

exports.index = function(req, res){
	renderWithLayout(req, res, 'index');
};


/*
 * GET /about
 */

exports.about = function(req, res){
	renderWithLayout(req, res, 'about');
};


/*
 * GET /login
 */
exports.login = function(req, res){
	renderWithLayout(req, res, 'login', {user:req.user, message:req.flash('error')});
};


/*
 * Render error page
 */
exports.errorPage = function (status, message, req, res) {
    res.status(status);
    renderWithLayout(req, res, 'error', {message: status + ' - ' + message});
}

/*
 * GET /account
 */

exports.profile = function(req, res){
    throw new Error('Something happened');
    renderWithLayout(req, res, 'profile');
};


/*
 * GET /hierarchy
 */

exports.hierarchy = function(req, res){
    renderWithLayout(req, res, 'hierarchy');
};






