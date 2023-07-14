const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://MetaAdmin:ql4R9W00MYgsZ3qy@taskmanager.x5nspqq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db("TaskManagerDB");
    console.log("Connected to MongoDB");
    return db; // Export the connected db
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // If connection fails, throw the error
  }
}

module.exports = { connectToMongoDB };
