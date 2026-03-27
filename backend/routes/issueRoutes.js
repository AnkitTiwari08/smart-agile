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

// CREATE
router.post("/", createIssue);

// GET
router.get("/", getIssues);

// STATS
router.get("/stats", getIssueStats);

// UPDATE ISSUE
router.put("/:id", updateIssue);

// UPDATE STATUS (DRAG)
router.put("/:id/status", updateStatus);

// 🔥 ASSIGN USER
router.put("/:id/assign", assignUser);

// DELETE
router.delete("/:id", deleteIssue);

module.exports = router;