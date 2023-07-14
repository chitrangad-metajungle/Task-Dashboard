const userModel = require("../models/userModel");

async function verifyPassword(username, password) {
  try {
    const user = await userModel.findOne({ username: username });

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
  try {
    const result = await userModel.find({});
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while retrieving users");
  }
}

module.exports = { verifyPassword, checkAllUsers };
