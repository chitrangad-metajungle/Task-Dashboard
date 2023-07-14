const { connectToMongoDB } = require("../src/config/database.js");

async function getAllTasks() {
  const db = await connectToMongoDB();
  const collection = db.collection("tasks");

  try {
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving tasks");
  }
}

async function addTask(task) {
  const db = await connectToMongoDB();
  const collection = db.collection("tasks");

  try {
    const result = await collection.insertOne(task);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while adding a task");
  }
}

async function deleteTask(taskId) {
  const db = await connectToMongoDB();
  const collection = db.collection("tasks");
  try {
    const result = await collection.deleteOne({ id: taskId });
    return result;
  } catch (error) {
    throw new Error("An error occurred while deleting a task");
  }
}

async function updateTask(taskId, updateobject) {
  const db = await connectToMongoDB();
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

module.exports = { getAllTasks, addTask, deleteTask, updateTask };
