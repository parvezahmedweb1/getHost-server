const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("colors");
require("dotenv").config();
// ? middle ware
app.use(cors());
app.use(express.json());
// ? mongodb
const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASSWORD}@cluster0.mc1suux.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
);
// ? dbConnected
const dbConnected = async () => {
  try {
    await client.connect();
    console.log("Database is Connected".yellow);
  } catch (error) {
    console.log(error.name, error.message, error.state);
  }
};
dbConnected();
const Services = client.db("GetHost").collection("Services");
const Reviews = client.db("GetHost").collection("Users");

// ? get the services
app.get("/services", async (req, res) => {
  try {
    const result = await Services.find({}).sort({ _id: -1 }).toArray();
    res.send({
      success: true,
      services: result,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ? get the services limit
app.get("/limit", async (req, res) => {
  try {
    const result = await Services.find().sort({ _id: -1 }).limit(3).toArray();
    res.send({
      success: true,
      services: result,
    });
  } catch (err) {
    console.log(err.message);
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ? add new service
app.post("/services", async (req, res) => {
  try {
    const result = await Services.insertOne(req.body);
    console.log(result);
    res.send({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.log(err.message);
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ? review
app.post("/reviews", async (req, res) => {
  try {
    const result = await Reviews.insertOne(req.body);
    res.send({
      success: true,
      acknowledged: result.acknowledged,
    });
  } catch (err) {
    console.log(err.message);
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ? get reviews
app.get("/reviews", async (req, res) => {
  try {
    let query = {};
    if (req.query.email) {
      query = {
        useEmail: req.query.email,
      };
    }
    const reviews = await Reviews.find(query).toArray();
    res.send(reviews);
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ? get the selected service
app.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Services.findOne({ _id: ObjectId(id) });
    res.send({
      success: true,
      service: result,
    });
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
    });
  }
});
// ------------------------------------
app.get("/", (req, res) => {
  res.send("GetHost Server is Running...");
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`.bgCyan);
});
