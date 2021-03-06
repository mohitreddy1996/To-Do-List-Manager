var mongoClient = require('mongodb').MongoClient;
var cons = require('./constants');

var Client = {};

Client.getDB = function (cb, dbName) {
    if(dbName == null){
        dbName = cons.DBName;
    }
    var dbUrl = cons.DBUrl(dbName);
    mongoClient.connect(dbUrl, function (err, db) {
        if(err){
            console.error("Failed to connect to %s, %s", dbUrl, err);
        }else{
            console.log("Mongo Client Connected to : " + dbUrl);
            cb(db);
        }
    });
};


Client.findInDB = function (dbName, collName, query, start, count, cb){
    Client.getDB(function (db) {
        var coll = db.collection(collName);
        coll.find(query, {skip: start}).limit(count).toArray(cb);
    }, dbName);    
};

Client.insertInDB = function (dbName, collName, dbObj, callback) {
    Client.getDB(function (db) {
        var coll = db.collection(collName);
        coll.insert(dbObj, callback);
    }, dbName);  
};

Client.updateInDB = function (dbName, collName, query, updateObj, upsert, callback) {
    Client.getDB(function(db){
        var coll = db.collection(collName);
        coll.update(query, updateObj, {upsert: upsert, w:1}, callback);
    }, dbName);  
};

Client.deleteInDB = function (dbName, collName, query, callback) {
    Client.getDB(function(db){
        var coll = db.collection(collName);
        coll.remove(query, null, callback);
    }, dbName);
};

module.exports = Client;