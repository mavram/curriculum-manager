/*
 * Init the model
 */
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    config = require('../config');

var _dbName = config.get('database:name');
var _dbHost = config.get('database:host');
var _dbPort = config.get('database:port');
var _dbServerOptions = config.get('database:server');
var _dbOptions = config.get('database:options');

var _dbServer = new Server(_dbHost, _dbPort, _dbServerOptions);
var _db = new Db(_dbName, _dbServer, _dbOptions);

module.exports = exports = {
    db: _db,
    name: _dbName,
    options: _dbOptions,
    init: function (next) {
        _db.open(function (err) {
            if (err) {
                throw new Error('Failed to connect to database ' + _dbName + ' on ' + _dbHost + ':' + _dbPort + '. ' + err);
            } else {
                next();
            }
        });
    },
    _id: function (id) {
        if (id instanceof Object) {
            return id;
        }
        return  _db.bson_serializer.ObjectID.createFromHexString(id);
    }
};