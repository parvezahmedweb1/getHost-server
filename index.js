const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("colors");
require("dotenv").config();
// ? middle ware
app.use(cors());
app.use(express.json());
// ? mongodb
const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASSWORD}@cluster0.mc1suux.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
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
const Users = client.db("GetHost").collection("Users");
// ? get the services
app.get("/services", async (req, res) => {
  try {
    const result = await Services.find({}).toArray();
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
// ------------------------------------
app.get("/", (req, res) => {
  res.send("GetHost Server is Running...");
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`.bgCyan);
});
