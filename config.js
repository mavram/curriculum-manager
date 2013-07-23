/*
 * Configuration helper
 */

function Config(env) {
    this.env = env;
    if (!this.env) {
        env = 'development';
    }

    console.log('Loading ' + env + ' configuration...');

    this.nconf = require('nconf');
    this.nconf.file({ file: './cfg/' + env + '.json' }).load();
    this.nconf.set('env', this.env);

    if (!this.nconf.get('database:name')) {
        this.nconf.set('database:name', this.nconf.get('database:name-prefix') + '-' + this.env);
    }
}

Config.prototype.get = function (property) {
    return this.nconf.get(property);
};

Config.prototype.isTestEnv = function () {
    return (this.env === 'test');
};

Config.prototype.isProductionEnv = function () {
    return (this.env === 'production');
};

module.exports = exports = new Config(process.env.NODE_ENV);
