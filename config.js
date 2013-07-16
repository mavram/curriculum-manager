/*
 * Configuration helper
 */

var nconf = require('nconf');

nconf.file({ file: './cfg/' + process.env.NODE_ENV + '.json' }).load();
if (!nconf.get('database:name')) {
    nconf.set('database:name', nconf.get('database:name-prefix') + '-' + process.env.NODE_ENV);
}

module.exports = exports = nconf;
