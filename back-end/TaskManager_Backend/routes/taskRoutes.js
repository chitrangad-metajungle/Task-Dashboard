const express = require("express");
const {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/api/tasks", async (req, res) => {
  // ...rest of the code
});

router.post("/api/tasks", async (req, res) => {
  // ...rest of the code
});

router.delete("/api/tasks/:taskId", async (req, res) => {
  // ...rest of the code
});

router.put("/api/tasks/:taskId", async (req, res) => {
  // ...rest of the code
});

module.exports = router;
