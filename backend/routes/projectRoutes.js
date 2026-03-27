const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");

// CREATE
router.post("/", projectController.createProject);

// GET ALL PROJECTS
router.get("/", projectController.getProjects);

// DELETE
router.delete("/:id", projectController.deleteProject);

// UPDATE
router.put("/:id", projectController.updateProject);

module.exports = router;