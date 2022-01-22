const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.inv.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// DATABASE //

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0v9zw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const runDatabase = async () => {
    try {
        await client.connect();
        const database = client.db("geniusCarMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hitting the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
};


runDatabase().catch(console.dir);



// NODE SERVER //

app.get('/', (req, res) => {
    res.send('Running genius server');
});

app.listen(port, () => {
    console.log('Running on port', port)
});