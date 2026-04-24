const express = require("express");
const router = express.Router();

const { register, login, getUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// PUBLIC
router.post("/register", register);
router.post("/login", login);

// 🔥 ONLY ADMIN CAN SEE USERS
router.get("/users", protect, adminOnly, getUsers);

module.exports = router;