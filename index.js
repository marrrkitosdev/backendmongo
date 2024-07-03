const express = require('express');
const {connectToDB, disconnectToDB} = require('./src/mongodb')
const app = express();
const PORT = process.env.PORT;

app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
})

app.get('/', (req, res) => {
    res.status(200).end('Hola');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

app.use('*', (req, res) => {
    res.status(404).send('Not Found');
})
