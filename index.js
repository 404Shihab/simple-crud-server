const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5zri8hr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const userCollection = client.db('simpleCrud').collection('users');

app.get('/', (req, res) => {
    res.send('Hello from simple crud server !!!!');
});

app.get('/users', async (req, res) => {
    const result = await userCollection.find().toArray();
    res.send(result);
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const user = await userCollection.findOne(query);
    res.send(user);
});

app.post('/users', async (req, res) => {
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    res.send(result);
});

app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const modifiedUser = req.body;
    const updateDocument = {
        $set: {
            name: modifiedUser.name,
            email: modifiedUser.email,
            role: modifiedUser.role,
        },
    };
    const result = await userCollection.updateOne(filter, updateDocument);
    res.send(result);
});

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app;