
const express = require("express");
const router = express.Router();

const {
  createIssue,
  getIssues,
  deleteIssue,
  updateStatus,
  updateIssue,
  assignUser,
  getIssueStats,
} = require("../controllers/issueController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// CREATE (ADMIN ONLY)
router.post("/", protect, adminOnly, createIssue);

// GET (ALL USERS)
router.get("/", protect, getIssues);

// STATS (ALL USERS)
router.get("/stats", protect, getIssueStats);

// UPDATE ISSUE (ADMIN ONLY)
router.put("/:id", protect, adminOnly, updateIssue);

// UPDATE STATUS (ADMIN ONLY)
router.put("/:id/status", protect, adminOnly, updateStatus);

// ASSIGN USER (ADMIN ONLY)
router.put("/:id/assign", protect, adminOnly, assignUser);

// DELETE (ADMIN ONLY)
router.delete("/:id", protect, adminOnly, deleteIssue);

module.exports = router;