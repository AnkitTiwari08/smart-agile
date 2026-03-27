const Issue = require("../models/Issue");
const Activity = require("../models/Activity");

// CREATE ISSUE
exports.createIssue = async (req, res) => {
  try {
    const { title, description, priority, project } = req.body;

    const issue = await Issue.create({
      title,
      description,
      priority,
      status: "todo",
      project,
    });

    // 🔥 ACTIVITY
    const activity = await Activity.create({
      message: `Issue "${issue.title}" created`,
      issue: issue._id,
      project: issue.project,
    });

    // 🔥 REAL-TIME ISSUE
    if (global.io) {
      global.io.emit("issueCreated", issue);
      global.io.emit("activityCreated", activity); // 🔥 NEW
    }

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ISSUES
exports.getIssues = async (req, res) => {
  try {
    const { project } = req.query;

    const filter = project ? { project } : {};

    const issues = await Issue.find(filter)
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ISSUE
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    await Issue.findByIdAndDelete(req.params.id);

    const activity = await Activity.create({
      message: `Issue "${issue?.title}" deleted`,
      project: issue?.project,
    });

    if (global.io) {
      global.io.emit("issueDeleted", req.params.id);
      global.io.emit("activityCreated", activity); // 🔥 NEW
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("assignee", "name email");

    const activity = await Activity.create({
      message: `Issue moved to ${status}`,
      issue: updated._id,
      project: updated.project,
    });

    if (global.io) {
      global.io.emit("issueUpdated", updated);
      global.io.emit("activityCreated", activity); // 🔥 NEW
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ISSUE
exports.updateIssue = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { title, description, priority },
      { new: true }
    ).populate("assignee", "name email");

    if (global.io) {
      global.io.emit("issueUpdated", updated);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ASSIGN USER
exports.assignUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignee: userId || null },
      { new: true }
    ).populate("assignee", "name email");

    const activity = await Activity.create({
      message: `User assigned to issue`,
      issue: issue._id,
      project: issue.project,
    });

    if (global.io) {
      global.io.emit("issueUpdated", issue);
      global.io.emit("activityCreated", activity); // 🔥 NEW
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STATS
exports.getIssueStats = async (req, res) => {
  try {
    const issues = await Issue.find();

    const stats = {
      total: issues.length,
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    issues.forEach((i) => {
      if (i.status === "todo") stats.todo++;
      else if (i.status === "in-progress") stats.inProgress++;
      else if (i.status === "done") stats.done++;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};