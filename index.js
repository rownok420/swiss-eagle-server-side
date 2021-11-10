const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");

require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amu9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("swiss_eagle");
        const productCollections = database.collection("products");
        
        //  GET SERVICE API
        app.get("/addProduct", async (req, res) => {
            const cursor = productCollections.find({});
            const product = await cursor.toArray();
            res.send(product);
        });

        // POST PRODUCT API
        app.post("/addProduct", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollections.insertOne(newProduct);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
            res.json(result);
        });



        console.log("Database connect");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Assignment Server is Started Successfully...");
});

app.listen(port, () => {
    console.log("Listing to Port", port);
});
