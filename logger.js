/*
 * Logging helper
 */


var colors = require('colors');

var logger = exports;

// TODO: logger level is not working. E.g. tests is always debug
logger.level = 'fatal';
logger.log = function (level, message) {
    var levels = ['fatal', 'error', 'warn', 'info', 'debug'];
    if (levels.indexOf(level) >= levels.indexOf(logger.level) ) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }

        var msg = new Date().toString() + ':' + process.pid + ':' + level + ': '+ message;
        if (levels.indexOf(level) < levels.indexOf('warn')) {
            msg = msg.bold.red;

        } else if (levels.indexOf(level) === levels.indexOf('debug')) {
            msg = msg.grey;
        }
        console.log(msg);
    }
};

logger.debug = function (msg) {
    logger.log('debug', msg);
};

logger.info = function (msg) {
    logger.log('info', msg);
};

logger.warn = function (msg) {
    logger.log('warn', msg);
};

logger.error = function (msg) {
    logger.log('error', msg);
};

logger.fatal = function (msg) {
    logger.log('fatal', msg);
};


// TODO: support for logging to file (with roll over)