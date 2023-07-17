const express = require("express");
const cors = require("cors");
const {
  verifyPassword,
  checkAllUsers,
} = require("./controllers/userController");
const {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask,
} = require("./controllers/taskController");
const {
  getAllProjects,
  addProject,
} = require("./controllers/projectController");
const { connectToMongoDB } = require("./src/config/database");
require("dotenv").config();
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors()); // Enable CORS
app.use(authenticateToken);

const port = process.env.PORT;

async function startServer() {
  await connectToMongoDB();
  app.post("/api/login", async (req, res) => {
    try {
      const result = await verifyPassword(req.body.username, req.body.password);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during login");
    }
  });

  app.get("/api/tasks", async (req, res) => {
    try {
      const result = await getAllTasks();
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while retrieving tasks");
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const result = await addTask(req.body);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while adding a task");
    }
  });

  app.delete("/api/tasks/:taskId", async (req, res) => {
    try {
      const result = await deleteTask(req.params.taskId);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while deleting a task");
    }
  });

  app.put("/api/tasks/:taskId", async (req, res) => {
    try {
      const result = await updateTask(req.params.taskId, req.body);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(600).send("An error occurred while updating a task");
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const result = await checkAllUsers();
      const usernames = result.map((user) => user.username);
      res.status(200).send(usernames);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while retrieving users");
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const result = await getAllProjects();
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while retrieving projects");
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = await addProject(req.body);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while adding a project");
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
