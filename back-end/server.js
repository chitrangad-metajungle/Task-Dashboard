const { MongoClient } = require("mongodb");
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

const express = require("express");
const app = express();
const port = 3000;

async function verifyPassword(username, password) {
    const db = client.db("TaskManagerDB");
    const collection = db.collection("users");

    try {
        const user = await collection.findOne({ username: username });

        if (!user) {
            return "User not found";
        }

        if (user.password === password) {
            return "Login successful";
        } else {
            return "Incorrect password";
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred during password verification");
    }
}

app.post("/login", async (req, res) => {
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// async function getResult(username, password) {
//     try {
//         const result = await verifyPassword(username, password);
//         console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
// }

// getResult("Rishabh", "12345abcde");
