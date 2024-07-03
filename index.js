const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

const uri = 'your_mongodb_connection_string'; // Reemplaza esto con tu URI de MongoDB

async function connectToDB() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        return client;
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }
}

async function disconnectToDB(client) {
    try {
        await client.close();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("Failed to disconnect from MongoDB", err);
    }
}

app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
})

app.get('/', (req, res) => {
    res.status(200).end('Hola');
});

app.get('/computacion', async (req, res) => {
    let client;
    try {
        client = await connectToDB();
        const db = client.db('computacion');
        const computacion = await db.collection('Productos').find().toArray();
        res.json(computacion);
    } catch (err) {
        console.error("Error fetching data from MongoDB", err);
        res.status(500).json({ error: 'Failed to fetch data' });
    } finally {
        if (client) {
            await disconnectToDB(client);
        }
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
