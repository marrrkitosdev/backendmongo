const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;
const { connectToDB, disconnectToDB } = require('./src/mongodb');

app.use(express.json());

app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

app.get('/', async (req, res) => {
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

app.get('/id/:id', async (req, res) => {
    let client;
    try {
        client = await connectToDB(client);
        const db = client.db('computacion');
        const productoId = parseInt(req.params.id);
        const producto = await db.collection('Productos').findOne({ codigo: productoId });
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

app.get('/nombre/:nombre', async (req, res) => {
    let client;
    try {
        client = await connectToDB(client);
        const db = client.db('computacion');
        const nombre = req.params.nombre || '';

        const query = { nombre: { $regex: new RegExp(nombre, 'i') } };

        const producto = await db.collection('Productos').findOne(query);
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


app.post('/computacion/create', async (req, res) => {
    const productNew = req.body;
    console.log(productNew);
    let client;

    try {
        client = await connectToDB(client);
        const db = client.db('computacion');
        const count = await db.collection('Productos').countDocuments();
        productNew.codigo = count + 1;

        await db.collection('Productos').insertOne(productNew);
        res.status(201).send(productNew);
    } catch (err) {
        console.error("Error al crear el registro", err);
        res.status(500).send("Error al crear el registro");
    } finally {
        if (client) {
            await disconnectToDB(client);
        }
    }
});

app.put('/computacion/update/:id', async (req, res) => {
    const productUpdate = req.body;
    console.log(productUpdate);
    const id = parseInt(req.params.id);
    let client;

    try {
        client = await connectToDB(client);
        const db = client.db('computacion').collection('Productos');
        const result = await db.updateOne({ codigo: id }, { $set: productUpdate });

        if (result.matchedCount === 0) {
            return res.status(404).send("Producto no encontrado");
        }

        res.status(200).json(productUpdate);
    } catch (error) {
        console.error("Error al actualizar el registro", error);
        res.status(500).send("Error al actualizar el registro");
    } finally {
        if (client) {
            await disconnectToDB(client);
        }
    }
});

app.delete('/computacion/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let client;

    try {
        client = await connectToDB(client);
        const db = client.db('computacion').collection('Productos');
        const result = await db.deleteOne({ codigo: id });

        if (result.deletedCount === 0) {
            return res.status(404).send("No se encontró el producto con el id: " + id);
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error al borrar el producto", error);
        res.status(500).send("Error al borrar el producto");
    } finally {
        if (client) {
            await disconnectToDB(client);
        }
    }
});


app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
