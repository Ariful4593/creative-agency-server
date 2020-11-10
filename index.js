const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
const { ObjectID,ObjectId } = require('mongodb');
const path = require('path')
require('dotenv').config()

const app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send("Hello Ariful")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xsirj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const agencyCollection = client.db("creatingAgency").collection("order");
    const reviewOrder = client.db("creatingAgency").collection("reviewOrder");
    const adminCollection = client.db("creatingAgency").collection("admin");
    const addService = client.db("creatingAgency").collection("addService");
    const crudCollection = client.db("creatingAgency").collection("crud");
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        console.log(product)
        // crudCollection.insertOne({product})
        //     .then(result => {
        //         console.log('One Product Added')
        //     })
    })
    app.post('/order', (req, res) => {

        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const service = req.body.service;
        const description = req.body.description;
        const price = req.body.price;
        const status = req.body.status;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        agencyCollection.insertOne({ name, email, service, description, status, price, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/reviewOrder', (req, res) => {
        const review = req.body;
        console.log(review)
        reviewOrder.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/getReviewOrder', (req, res) => {
        reviewOrder.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/getOrder', (req, res) => {
        // const email = req.body.email;
        agencyCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/getOrderViaEmail', (req, res) => {
        const email = req.body.email;
        agencyCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/makeAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.insertOne({ email })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
            })
    })

    app.post('/addService', (req, body) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        addService.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/getServiceData', (req, res) => {
        addService.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.patch('/update', (req, res) => {
        agencyCollection.updateOne(
            { _id: ObjectID(req.body.id) },
            {
                $set: { 'status': req.body.status }
            }
        )
            .then(result => {
                console.log(result)
            })

    })
});



const port = 4000;
app.listen(process.env.PORT || port)