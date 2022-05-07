const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv').config()
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello World!')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a24qz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client1 = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        await client1.connect()
        const bookCollection = client.db("library").collection('books')
        const myBookCollection = client1.db("library").collection('mybook')
        app.get("/inventory", async (req, res) => {
            const query = {}
            const cursor = bookCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get("/inventory/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const cursor = await bookCollection.findOne(query)
            res.send(cursor)
        })
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const variable = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            console.log('Hello')

            const updateDoc = {
                $set: {
                    quantity: variable.quantity
                }
            };
            const result = await bookCollection.updateOne(filter, updateDoc, options);

        })
        app.post("/mybook", async (req, res) => {
            const book = req.body
            console.log((req.body))
            console.log(book)
            const result = await myBookCollection.insertOne(book)




        })
        app.get("/mybook", async (req, res) => {
            const data = req.query
            console.log(data)
            const cursor = myBookCollection.find(data);
            const result = await cursor.toArray()

            res.send(result)
        })



    }
    finally {

    }
}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});