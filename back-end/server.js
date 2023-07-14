const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

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
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

const app = express();
app.use(express.json()); // This is the middleware for parsing JSON bodies
app.use(cors()); // Enable CORS for all origins

const port = 8000;

//APIs

// Verify password
async function verifyPassword(username, password) {
  const collection = db.collection("users");

  try {
    const user = await collection.findOne({ username: username });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.password === password) {
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: "Incorrect password" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred during password verification");
  }
}

app.post("/api/login", async (req, res) => {
  try {
    const result = await verifyPassword(req.body.username, req.body.password);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// Get all tasks from the database
async function getAllTasks() {
  const collection = db.collection("tasks");

  try {
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving tasks");
  }
}

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await getAllTasks();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving tasks");
  }
});

//Add new task to database
async function addTask(task) {
  const collection = db.collection("tasks");

  try {
    const result = await collection.insertOne(task);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while adding a task");
  }
}

app.post("/api/tasks", async (req, res) => {
  try {
    const result = await addTask(req.body);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding a task");
  }
});

//Delete task from database
async function deleteTask(taskId) {
  const collection = db.collection("tasks");
  try {
    const result = await collection.deleteOne({ id: taskId });
    return result;
  } catch (error) {
    throw new Error("An error occurred while deleting a task");
  }
}

app.delete("/api/tasks/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const result = await deleteTask(taskId);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting a task");
  }
});

//Update task in database
async function updateTask(taskId, updateobject) {
  const collection = db.collection("tasks");
  const updateQuery = { $set: {} };

  const allowedUpdates = ["assignedTo", "priority", "completionDate", "status"];

  for (const [key, value] of Object.entries(updateobject)) {
    if (allowedUpdates.includes(key)) updateQuery.$set[key] = value;
  }

  try {
    const result = await collection.updateOne({ id: taskId }, updateQuery);
    return result;
  } catch (error) {
    throw new Error("An error occurred while updating a task");
  }
}

app.put("/api/tasks/:taskId", async (req, res) => {
  taskId = req.params.taskId;
  try {
    const result = await updateTask(taskId, req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("An error occurred while updating a task");
  }
});

//Check all users exists
async function checkAllUsers() {
  const collection = db.collection("users");
  try {
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving users");
  }
}

app.get("/api/users", async (req, res) => {
  try {
    const result = await checkAllUsers();
    const usernames = result.map((user) => user.username);
    res.status(200).send(usernames);
  } catch (error) {
    res.status(500).send("An error occurred while retrieving users");
    throw new Error("An error occurred while retrieving users");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
