var mongodb = require('mongodb'),
    stepdown = require('stepdown'),
    url = require('url');

function MongoDBAdapter(serverConfig, options) {
    this._dbs = {};
    this._collections = {};
    this._dbOptions = options;
    this._initialDb = new mongodb.Db('test', serverConfig, options);
}

MongoDBAdapter.prototype.ensureConnection = function(callback) {
    if (this._initialDb.openCalled) {
        callback(null);
    } else {
        this._initialDb.open(function (err) {
            callback(err);
        });
    }
};

MongoDBAdapter.prototype.getDb = function(databaseName) {
    return this._initialDb.db(databaseName);
};

MongoDBAdapter.prototype.getCollection = function(db, collectionName, callback) {
    var self = this;

    if (self._collections[collectionName]) {
        callback(null, self._collections[collectionName]);
    } else {
        stepdown([function ensureConnection() {
            self.ensureConnection(this.next);
        }, function getCollection() {
            self.db.collection(collectionName, this.next);
        }, function cacheCollection(collection) {
            this._collections[collectionName] = collection;
            return collection;
        }], callback);
    }
};

MongoDBAdapter.prototype._parsePath = function(path) {
    var parsed = url.parse(path);

    if (parsed.protocol && ['mongo:', 'mongodb:'].indexOf(parsed.protocol) === -1) {
        return null;
    }
    if (parsed.host) {
        return null;
    }

    path = parsed.pathname.split('/');

    if (path.length < 3) {
        return null;
    }

    return {
        database: path[0],
        collection: path[1],
        id: path[2]
    };
};

MongoDBAdapter.prototype.exists = function(path, callback) {
};

MongoDBAdapter.prototype.readFile = function(path, encoding, callback) {
};

MongoDBAdapter.prototype.writeFile = function(path, data, encoding, callback) {
};

MongoDBAdapter.prototype.unlink = function(path, callback) {
};

MongoDBAdapter.prototype.rmdir = function(path, callback) {
};

MongoDBAdapter.prototype.mkdir = function(path, mode, callback) {
};

MongoDBAdapter.prototype.appendFile = function(path, data, encoding, callback) {
};

module.exports = MongoDBAdapter;
