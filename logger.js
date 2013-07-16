/*
 * Logging helper
 */

var colors = require('colors'),
    config = require('./config');


var Logger = function (cfg) {
    this.logLevels = ['fatal', 'error', 'warn', 'info', 'debug'];
    this.cfg = cfg;
};


Logger.prototype.log = function (level, message) {
    if (this.logLevels.indexOf(this.cfg.level) >= this.logLevels.indexOf(level) ) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }

        var msg = new Date().toString() + ':' + process.pid + ':' + level + ': '+ message;
        if (this.logLevels.indexOf(level) < this.logLevels.indexOf('warn')) {
            msg = msg.bold.red;

        } else if (this.logLevels.indexOf(level) === this.logLevels.indexOf('debug')) {
            msg = msg.grey;
        }
        console.log(msg);
    }
};

Logger.prototype.debug = function (msg) {
    this.log('debug', msg);
};

Logger.prototype.info = function (msg) {
    this.log('info', msg);
};

Logger.prototype.warn = function (msg) {
    this.log('warn', msg);
};

Logger.prototype.error = function (msg) {
    this.log('error', msg);
};

Logger.prototype.fatal = function (msg) {
    this.log('fatal', msg);
};

module.exports = exports = new Logger({ level: 'debug' });


// TODO: support for logging to file (with roll over)