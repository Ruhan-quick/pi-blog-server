const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER);

app.get("/", (req, res) => {
  res.send("Hello World Bro Can you here me!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oiqme.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log("uri: ", uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection error: ", err);
  const blogCollection = client.db("piBlog").collection("blogs");
  console.log("Database Connected Successfully");

  app.post("/addBlog", (req, res) => {
    const blog = req.body;
    blogCollection.insertOne(blog).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/showBlogs", (req, res) => {
    blogCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(process.env.PORT || port);
