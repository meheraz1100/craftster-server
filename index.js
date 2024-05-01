const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// craftSter
// kFGUhW5RXvzpuvG4

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bgw1n6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const craftCollection = client.db('craftDB').collection('crafts')



    app.get('/addCraftItem', async(req, res) => {
      const cursor = craftCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/addCraftItem/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result)
    })

    app.put('/addCraftItem/:id', async (req, res) => {
      const id = req.params.id;    
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updatedCraft = req.body;
      const craft = {
        $set : {
          email: updatedCraft.name,
          name: updatedCraft.name,
          item_name: updatedCraft.item_name,
          image_url: updatedCraft.image_url,
          subcatagory: updatedCraft.subcatagory,
          short_description: updatedCraft.short_description,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processing_time: updatedCraft.processing_time,
          stockStatus: updatedCraft.stockStatus
        }
      }

      const result = await craftCollection.updateOne(filter, craft, options)
      res.send(result)
    })

    // app.get('/addCraftItem/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result = await craftCollection.findOne(query)
    //   res.send(result)
    // })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.post('/addCraftItem', async(req, res) => {
      const craftItem = req.body;
      console.log('new craft item', craftItem)
      const result = await craftCollection.insertOne(craftItem)
      res.send(result)
    })

    app.delete('/addCraftItem/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id) }
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Craftster server is running!!!')
})

app.listen(port, () => {
    console.log(`crafster server running on port ${port}`)
})
