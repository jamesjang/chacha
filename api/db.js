const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://jamesjang:ihateamy@cluster0.rptyw.mongodb.net/test?retryWrites=true&w=majority';

var state = {
    db: null,
  };

function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) { 
    MongoClient.connect(uri, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            state.db = dbInstance.db(dbName);
            successCallback(dbCollection);
        }
    }); 
}

function getDB() {
    return state.db;
}

function getCollection() {
    return state.collection;
}

module.exports = {
    initialize,
    getDB,
    getCollection
};