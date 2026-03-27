import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../services/projectService";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProjects([]);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingProjectId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return alert("Project name is required");
    }

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, formData);
      } else {
        await createProject(formData);
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      alert(error?.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setFormData({
      name: project.name || "",
      description: project.description || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Create, update, search, and manage projects</p>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card form-card" style={{ marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "20px" }}>
            {editingProjectId ? "Edit Project" : "Create New Project"}
          </h2>

          <div className="auth-form">
            <input
              type="text"
              placeholder="Project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <textarea
              placeholder="Project description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="row">
              <button className="btn-primary" onClick={handleSubmit}>
                {editingProjectId ? "Update Project" : "Create Project"}
              </button>

              {editingProjectId && (
                <button className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="glass-card empty-box">No projects found.</div>
        ) : (
          <div className="project-list">
            {filteredProjects.map((project) => (
              <div className="glass-card project-card" key={project._id}>
                <h3>{project.name}</h3>
                <p>{project.description || "No description"}</p>

                <div className="project-actions">
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    Open Board
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;