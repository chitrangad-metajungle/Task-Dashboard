const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const uri =
    "mongodb+srv://MetaAdmin:ql4R9W00MYgsZ3qy@taskmanager.x5nspqq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectToMongoDB() {
    try {
        await client.connect();
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

// Verify password
async function verifyPassword(username, password) {
    const db = client.db("TaskManagerDB");
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
        const result = await verifyPassword(
            req.body.username,
            req.body.password
        );
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Get all tasks
async function getAllTasks() {
    const db = client.db("TaskManagerDB");
    const collection = db.collection("tasks");
    //to do
}

//Add new task
async function addTask(task) {
    const db = client.db("TaskManagerDB");
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
