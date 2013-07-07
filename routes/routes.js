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
 * GET /
 */

exports.index = function(req, res){
	renderWithLayout(req, res, 'index');
};


/*
 * GET /login
 */

exports.login = function(req, res){
    renderWithLayout(req, res, 'login');
};


/*
 * Render error page
 */
exports.errorPage = function (status, message, req, res) {
    res.status(status);
    renderWithLayout(req, res, 'error', {message: status + ' - ' + message});
}
