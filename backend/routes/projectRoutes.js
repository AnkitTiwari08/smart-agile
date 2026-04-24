const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// CREATE (ADMIN ONLY)
router.post("/", protect, adminOnly, projectController.createProject);

// GET ALL (ALL USERS)
router.get("/", protect, projectController.getProjects);

// UPDATE (ADMIN ONLY)
router.put("/:id", protect, adminOnly, projectController.updateProject);

// DELETE (ADMIN ONLY)
router.delete("/:id", protect, adminOnly, projectController.deleteProject);

module.exports = router;