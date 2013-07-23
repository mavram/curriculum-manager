/*
 * Model
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;


function Model (config) {
    this.cfg = config.get('database');
    var server = new Server(this.cfg.host, this.cfg.port, this.cfg.server);
    this.db = new Db(this.cfg.name, server, this.cfg.options);
}

Model.prototype.init = function (next) {
    var _cfg = this.cfg;
    this.db.open(function (err) {
        if (err) {
            throw new Error('Failed to connect to database ' + _cfg.name + ' on ' + _cfg.host + ':' + _cfg.port + '. ' + err);
        } else {
            next();
        }
    });
};

Model.prototype._id = function (id) {
    if (id instanceof Object) {
        return id;
    }
    return ObjectID.createFromHexString(id);
};

Model.prototype._generateId = function () {
    return new ObjectID();
};


module.exports = exports = new Model(require('../config'));
