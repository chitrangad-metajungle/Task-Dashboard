const taskModel = require("../models/taskModel");

async function getAllTasks() {
  try {
    const result = await taskModel.find({});
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving tasks");
  }
}

async function addTask(task) {
  try {
    const newTask = new taskModel(task);
    const result = await newTask.save();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while adding a task");
  }
}

async function deleteTask(taskId) {
  try {
    const result = await taskModel.deleteOne({ title: taskId });
    return result;
  } catch (error) {
    throw new Error("An error occurred while deleting a task");
  }
}

async function updateTask(taskId, updateobject) {
  const updates = ["assignedTo", "status"];

  try {
    const result = await taskModel.updateOne(
      { title: taskId },
      { $set: updateobject }
    );
    return result;
  } catch (error) {
    throw new Error("An error occurred while updating a task");
  }
}

module.exports = { getAllTasks, addTask, deleteTask, updateTask };
