/*
 * Logging helper
 */


var colors = require('colors');

var logger = exports;

logger.level = 'warn';
logger.log = function (level, message) {
    var levels = ['fatal', 'error', 'warn', 'info', 'debug'];
    if (levels.indexOf(level) >= levels.indexOf(logger.level) ) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        };

        var msg = new Date().toString() + ':' + process.pid + ':' + level + ': '+ message;
        if (levels.indexOf(level) < levels.indexOf('warn')) {
            msg = msg.bold.red;

        } else if (levels.indexOf(level) === levels.indexOf('debug')) {
            msg = msg.grey;
        }
        console.log(msg);
    }
}

// TODO: support for logging to file (with roll over)
// TODO: support for logger.debug/logger.info ....