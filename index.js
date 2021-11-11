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
        const ordersCollection = database.collection("orders");

        //  GET SERVICE API
        app.get("/getProduct", async (req, res) => {
            const cursor = productCollections.find({});
            const product = await cursor.toArray();
            res.send(product);
        });

        // GET SINGLE ORDER DATA
        app.get("/placeOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollections.findOne(query);
            res.json(result);
        });

        // FILTER ORDER DATA WITH EMAIL
        app.get("/myOrder/:email", async (req, res) => {
            const result = await ordersCollection
                .find({ email: req.params.email })
                .toArray();
            res.json(result);
        });

        // GET ALL ORDER API
        app.get("/allOrders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
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

        // POST PLACE ORDER API
        app.post("/placeOrder", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
            res.json(result);
        });

        // DELETE PRODUCT FROM MANAGE ORDERS
        app.delete("/deleteOrder/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log("deleting products", result);
            res.json(result);
        });

        // DELETE PRODUCT FROM MANAGE ORDERS
        app.delete("/deleteProduct/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollections.deleteOne(query);
            console.log("deleting products", result);
            res.json(result);
        });

        // UPDATE ORDER STATUS
        app.put("/allOrders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Shipped",
                },
            };
            const result = await ordersCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            console.log("updated product", id);
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
