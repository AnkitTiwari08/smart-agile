const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🔥 GET USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users); // MUST be array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;