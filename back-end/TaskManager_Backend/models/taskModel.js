//taskModel
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: { type: String, required: false },
  title: { type: String, required: false },
  project: { type: String, required: false },
  assignedTo: { type: String, required: false },
  priority: { type: String, required: false },
  status: { type: String, required: false },
  completionDate: { type: String, required: false },
});

module.exports = mongoose.model("Task", taskSchema, "tasks");
