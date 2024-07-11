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

app.post('/computacion/create', async (req, res) => {
    const productNew = req.body;
    console.log(productNew);
    let client;

    client = await connectToDB(client);
    const db = client.db('computacion');
    db.collection('Productos').insertOne(productNew).
    then((response) => {
        console.log("Producto agregado");
        res.status(201).send(productNew);
    })
    .catch((err) => res.status(500).send("Error al crear el registro"))
    .finally(async () => {
      await disconnectToDB();
    });
})

app.put('/computacion/update/:id', async (req, res) => {
    const productUpdate = req.body;
    const id = parseInt(req.params.id);
    const client = await connectToDB();

    if (!client){
        res.status(500).send("Error al conectarse a MongoDB");
        console.log("Client error");
        return;
    }

    if (!productUpdate || Object.keys(productUpdate).length === 0){
        res.status(400).send("Error en el formato del producto");
        return;
    }
    
    const db = client.db('computacion').collection('Productos');
    db
    .updateOne({codigo: id }, { $set: productUpdate })
    .then((response) => res.status(200).json(productUpdate))
    .catch((error) =>{
        res.status(500).send("Error al actualizar el registro")
        console.log(error)
    })
    .finally(async () => {
      await disconnectToDB();
    });
});

app.delete('/computacion/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const client = await connectToDB();
    if (!client){
        res.status(500).send("Error al conectarse a MongoDB");
    }
    if (!req.params.id){
        res.status(500).send("Error en el formato del producto");
    }
    client.connect()
    .then(() => {
        const db = client.db('computacion').collection('Productos');
        return db.deleteOne({codigo: id});
    })
    .then((result) => {
        if (result.deletedCount === 0){
            res.status(404).send("No se encontro el producto con el id: ", id);
        } else{
            console.log("Producto eliminado")
            res.status(204).send();
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Error al borrar el producto");
    })
    .finally(async () => {
        await disconnectToDB();
      });
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
