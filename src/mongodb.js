require('dotenv').config();

const { MongoClient } = require('mongodb');
const URI = process.env.URLSTRING_MONGODB;
const client = new MongoClient(URI);

async function connectToDB() {
    try {
        await client.connect();
        console.log('Conectado a Mongo');
        return client;
    } catch (error) {
        console.log('Error: ' + error);
        return null;
    }
}

async function disconnectToDB() {
    try {
        await client.close();
        console.log('Desconectado a Mongo');
    } catch (error) {
        console.log('Error: ' + error);
        return null;
    }
}

module.exports = {connectToDB, disconnectToDB}