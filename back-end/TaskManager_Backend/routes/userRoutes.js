const express = require("express");
const {
  verifyPassword,
  checkAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/api/login", async (req, res) => {
  // ...rest of the code
});

router.get("/api/users", async (req, res) => {
  // ...rest of the code
});

module.exports = router;
