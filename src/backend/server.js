const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ser401:<ser401>@cluster0.bjvvr.mongodb.net/<Explore>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const cors = require('cors');
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
