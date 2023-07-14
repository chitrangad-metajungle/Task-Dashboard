const { connectToMongoDB } = require("../src/config/database.js");

async function verifyPassword(username, password) {
  const db = await connectToMongoDB();
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

async function checkAllUsers() {
  const db = await connectToMongoDB();
  const collection = db.collection("users");
  try {
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving users");
  }
}

module.exports = { verifyPassword, checkAllUsers };
