var mongoose = require('mongoose');

var isConnected = false;
var isConnecting = false;
var lastError = null;

function connectToDatabase(uri) {
    if (isConnected) {
        return Promise.resolve(mongoose.connection);
    }
    if (isConnecting) {
        return Promise.resolve(null);
    }

    isConnecting = true;

    return mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
    }).then(function(connection) {
        isConnected = true;
        isConnecting = false;
        lastError = null;
        console.log('MongoDB connected');
        return connection;
    }).catch(function(err) {
        isConnected = false;
        isConnecting = false;
        lastError = err;
        console.error('MongoDB connection error:', err.message);
        return null;
    });
}

function isDatabaseAvailable() {
    return isConnected && mongoose.connection.readyState === 1;
}

function getDatabaseStatus() {
    return {
        available: isDatabaseAvailable(),
        lastError: lastError ? lastError.message : null
    };
}

module.exports = {
    connectToDatabase: connectToDatabase,
    isDatabaseAvailable: isDatabaseAvailable,
    getDatabaseStatus: getDatabaseStatus
};
