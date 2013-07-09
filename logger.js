//
// Utilities
//

var logger = exports;

logger.level = 'warn';
logger.log = function (level, message) {
    var levels = ['fatal', 'error', 'warn', 'info', 'debug'];
    if (levels.indexOf(level) >= levels.indexOf(logger.level) ) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        };
        console.log(level + ': '+ message);
    }
}