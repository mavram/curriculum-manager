/*
 * Model
 */
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    config = require('../config');


var Model = function (config) {
    this.dbName = config.get('database:name');
    this.dbHost = config.get('database:host');
    this.dbPort = config.get('database:port');
    this.dbServerOptions = config.get('database:server');
    this.dbOptions = config.get('database:options');
    this.dbServer = new Server(this.dbHost, this.dbPort, this.dbServerOptions);
    this.db = new Db(this.dbName, this.dbServer, this.dbOptions);
};

Model.prototype.init = function (next) {
    this.db.open(function (err) {
        if (err) {
            throw new Error('Failed to connect to database ' + dbName + ' on ' + dbHost + ':' + dbPort + '. ' + err);
        } else {
            next();
        }
    });
};

Model.prototype._id = function (id) {
    if (id instanceof Object) {
        return id;
    }
    return this.db.bson_serializer.ObjectID.createFromHexString(id);
};

module.exports = exports = new Model(config);
