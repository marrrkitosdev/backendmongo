const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;
const {connectToDB, disconnectToDB} =  require('./src/mongodb');

app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
})

app.get('/', (req, res) => {
    res.status(200).end('Hola, esta es la página principal del servidor');
});

app.get('/computacion', async (req, res) => {
    let client;
    try {
        client = await connectToDB(client);
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
app.get('/computacion/id/:id', async (req, res) => {
    let client;
    try {
        client = await connectToDB(client);
        const db = client.db('computacion');
        const productoId = parseInt(req.params.id);
        const producto = await db.collection('Productos').findOne({codigo: productoId})
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (err) {
        console.error("Hubo un error al recuperar los datos de nuestro sistema de datos", err);
        res.status(500).json({ error: 'Error al recuperar datos' });
    } finally {
        if (client) {
            await disconnectToDB(client);
        }
    }
});
app.get('/computacion/nombre/:nombre', async (req, res) => {
    let client;
    try {
        client = await connectToDB(client);
        const db = client.db('computacion');
        const nombre = (req.params.nombre || '');
        const producto = await db.collection('Productos').findOne({nombre: nombre})
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (err) {
        console.error("Hubo un error al recuperar los datos de nuestro sistema de datos", err);
        res.status(500).json({ error: 'Error al recuperar datos' });
    } finally {
        if (client) {
            await disconnectToDB(client);
        }
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
