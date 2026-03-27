import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  deleteProject,
  updateProject,
} from "../services/projectService";
import { getIssueStats } from "../services/issueService";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    done: 0,
  });

  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const projectData = await getProjects();
      setProjects(projectData || []);

      const statData = await getIssueStats();
      setStats(statData || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;
    await deleteProject(id);
    fetchData();
  };

  const handleEditClick = (project) => {
    setEditProject(project);
    setFormData({
      name: project.name || "",
      description: project.description || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await updateProject(editProject._id, formData);
      setEditProject(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div className="topbar">
        <div>
          <h1 className="page-title">🚀 Dashboard</h1>
          <p className="page-subtitle">
            Manage your projects like a pro
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-modern">
        <div className="stat-modern purple">
          <h3>Projects</h3>
          <p>{projects.length}</p>
        </div>

        <div className="stat-modern blue">
          <h3>Issues</h3>
          <p>{stats.total || 0}</p>
        </div>

        <div className="stat-modern orange">
          <h3>In Progress</h3>
          <p>{stats.inProgress || 0}</p>
        </div>

        <div className="stat-modern green">
          <h3>Completed</h3>
          <p>{stats.done || 0}</p>
        </div>
      </div>

      {/* PROJECTS */}
      <div style={{ marginTop: "30px" }}>
        <h2 className="page-title" style={{ fontSize: "1.8rem" }}>
          📁 Projects
        </h2>

        <div className="project-grid-modern">
          {projects.length === 0 ? (
            <div className="empty-box">No projects found</div>
          ) : (
            projects.map((p) => (
              <div key={p._id} className="project-modern-card">

                <h3>{p.name}</h3>

                <p>
                  {p.description
                    ? p.description.length > 100
                      ? p.description.slice(0, 100) + "..."
                      : p.description
                    : "No description"}
                </p>

                <div className="project-actions-modern">
                  <button onClick={() => navigate(`/projects/${p._id}`)}>
                    View
                  </button>

                  <button
                    className="edit"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editProject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Project</h2>

            <input
              placeholder="Project name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="btn-secondary"
                onClick={() => setEditProject(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;