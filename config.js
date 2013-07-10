/*
 * Configuration
 */

var nconf = require('nconf');

nconf.defaults({
    'env':'dev'
});

nconf.argv().load();
nconf.file({ file: './cfg/' + nconf.get('env') + '.json' }).load();

module.exports = exports = nconf;
