const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const dotenv = require('dotenv').config()
var jwt = require('jsonwebtoken');
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
// function verifyJwt(req, res, next) {
//     const authHeader = req.headers.authorization
//     const token1 = authHeader.split(' ')
//     const token = token1[1]
//     if (!authHeader) {
//         res.status(401).send({ message: 'Invalid' })
//     }
//     var decoded = jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             res.status(403).send({ message: "forbidden" })
//         }
//         req.decoded = decoded
//         console.log(req.decoded)
//         next()
//     });

// }


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
        // jwt tokens
        app.post('/login', async (req, res) => {
            const email = req.body
            console.log(email)
            var token = jwt.sign(email, process.env.ACCESS_TOKEN);
            res.send({ token })

        })
        app.post('/register', async (req, res) => {
            const email = req.body
            console.log(email)
            var token = jwt.sign(email, process.env.ACCESS_TOKEN);
            res.send({ token })

        })


        // services API
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
            const result = await myBookCollection.insertOne(book)




        })
        app.get("/mybook", async (req, res) => {
            // const verifyEmail = req.decoded.email

            const data = req.query
            const logInEmail = data.email
            // if (logInEmail === verifyEmail) {
            const cursor = myBookCollection.find(data);
            const result = await cursor.toArray()

            res.send(result)
            // }

        })
        // app.delete('/inventory/:id', async (req, res) => {
        //     const id = req.params.id
        //     console.log(id)
        //     const filter = { _id: ObjectId(id) }
        //     const query = await bookCollection.deleteOne(filter)
        //     res.send(query)
        // })
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookCollection.deleteOne(query);
            //console.log(result)
            res.send(result)
        })
        app.delete('/mybook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myBookCollection.deleteOne(query);
            //console.log(result)
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