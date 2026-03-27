const Project = require("../models/Project");
const Issue = require("../models/Issue");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Project name is required" });
    }

    const existing = await Project.findOne({ name: name.trim() });

    if (existing) {
      return res.status(400).json({
        message: "Project with this name already exists"
      });
    }

    const newProject = new Project({
      name: name.trim(),
      description: description || ""
    });

    await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: newProject
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PROJECT
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROJECT + ISSUES
exports.deleteProject = async (req, res) => {
  try {
    await Issue.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project and its issues deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};