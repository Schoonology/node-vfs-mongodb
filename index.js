module.exports = {
    Adapter: require('./lib/vfs-mongodb'),
    Server: require('mongodb').Server,
    ReplSet: require('mongodb').ReplSet,
    Mongos: require('mongodb').Mongos
};
