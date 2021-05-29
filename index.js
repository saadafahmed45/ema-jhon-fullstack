const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require ('cors');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvccs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 4000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("emajhonData").collection("products");
  const ordersCollection = client.db("emajhonData").collection("orders");

  console.log('database connected');



app.post('/addProduct',(req, res) => {
    const product = req.body;
    productsCollection.insertMany(product)
   .then(result => {
    console.log(result.insertedCount);
    res.send(result.insertedCount)
  })
})
 
 app.get('/products', (req, res) => {
  productsCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
 })

 app.get('/products/:key', (req, res) => {
  productsCollection.find({key:req.params.key})
  .toArray((err,documents)=>{
    res.send(documents[0])
  })
 })



app.post('/productsByKeys',(req, res)=>{
  const productKeys = req.body;

  productsCollection.find({key:{$in:productKeys}})
.toArray((err,documents) => {
res.send(documents)
})
})





// order

app.post('/addOrder',(req, res) => {
  const product = req.body;
  ordersCollection.insertOne(product)
 .then(result => {
   res.send(result.insertedCount > 0)
})
})

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)