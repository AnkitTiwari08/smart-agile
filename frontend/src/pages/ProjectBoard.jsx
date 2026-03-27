import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import {
  getIssuesByProject,
  createIssue,
  deleteIssue,
  updateIssueStatus,
} from "../services/issueService";

import { getActivities } from "../services/activityService";
import IssueCard from "../components/IssueCard";
import socket from "../services/socket";
import toast from "react-hot-toast";

// STATUS NORMALIZER
const normalizeStatus = (status) => {
  if (!status) return "todo";
  const s = status.toLowerCase().trim();

  if (s === "todo") return "todo";
  if (s === "inprogress" || s === "in-progress") return "in-progress";
  if (s === "done") return "done";

  return "todo";
};

const columns = [
  { id: "todo", title: "TODO" },
  { id: "in-progress", title: "IN PROGRESS" },
  { id: "done", title: "DONE" },
];

const ProjectBoard = () => {
  const { id } = useParams();

  const [issues, setIssues] = useState([]);
  const [activities, setActivities] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  // 🔥 FILTER STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // FETCH ISSUES
  const fetchIssues = async () => {
    try {
      const data = await getIssuesByProject(id);

      const fixed = (data || []).map((i) => ({
        _id: String(i._id),
        title: i.title || "Untitled Issue",
        description: i.description || "No description",
        status: normalizeStatus(i.status),
        priority: i.priority || "medium",
        createdAt: i.createdAt,
        assignee: i.assignee || null,
      }));

      setIssues(fixed);
    } catch (err) {
      console.error(err);
      setIssues([]);
    }
  };

  // FETCH ACTIVITY
  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIssues();
      fetchActivities();
    }
  }, [id]);

  // SOCKET
  useEffect(() => {
    socket.on("issueCreated", () => {
      fetchIssues();
      fetchActivities();
      toast.success("New issue created 🚀");
    });

    socket.on("issueUpdated", () => {
      fetchIssues();
      fetchActivities();
      toast("Issue updated 🔄");
    });

    socket.on("issueDeleted", () => {
      fetchIssues();
      fetchActivities();
      toast.error("Issue deleted ❌");
    });

    socket.on("activityCreated", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.off("issueCreated");
      socket.off("issueUpdated");
      socket.off("issueDeleted");
      socket.off("activityCreated");
    };
  }, []);

  // CREATE
  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    await createIssue({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      project: id,
    });

    setFormData({
      title: "",
      description: "",
      priority: "medium",
    });
  };

  // DELETE
  const handleDelete = async (issueId) => {
    await deleteIssue(issueId);
  };

  // DRAG
  const handleDragEnd = async (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newStatus = normalizeStatus(destination.droppableId);
    await updateIssueStatus(draggableId, newStatus);
  };

  // FILTER LOGIC
  const visibleIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = issue.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        issue.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [issues, search, statusFilter, priorityFilter]);

  return (
    <div style={wrapper}>
      <h1 style={heading}>🚀 Project Board</h1>

      {/* FILTER BAR */}
      <div style={filterBar}>
        <input
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={filterInput}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={filterSelect}
        >
          <option value="all">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={filterSelect}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div style={mainLayout}>
        {/* LEFT */}
        <div style={leftSide}>
          {/* CREATE */}
          <div style={formBox}>
            <input
              placeholder="Enter title..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              style={input}
            />

            <textarea
              placeholder="Description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              style={{ ...input, height: "60px" }}
            />

            <button style={btn} onClick={handleCreate}>
              Create Issue
            </button>
          </div>

          {/* BOARD */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div style={board}>
              {columns.map((col) => {
                const items = visibleIssues.filter(
                  (i) => normalizeStatus(i.status) === col.id
                );

                return (
                  <Droppable key={col.id} droppableId={col.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={column}
                      >
                        <h3 style={columnTitle}>{col.title}</h3>

                        {items.map((issue, index) => (
                          <Draggable
                            key={issue._id}
                            draggableId={issue._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <IssueCard
                                  issue={issue}
                                  onDelete={handleDelete}
                                  refresh={fetchIssues}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={rightSide}>
          <h2>📜 Activity</h2>

          {activities.map((a) => (
            <div key={a._id} style={activityItem}>
              <p>{a.message}</p>
              <small>
                {new Date(a.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🎨 STYLES

const wrapper = {
  minHeight: "100vh",
  padding: "20px",
  background: "#020617",
};

const heading = {
  color: "#fff",
  marginBottom: "20px",
};

const filterBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const filterInput = {
  flex: 2,
  padding: "8px",
  borderRadius: "8px",
};

const filterSelect = {
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
};

const mainLayout = {
  display: "flex",
  gap: "20px",
};

const leftSide = {
  flex: 3,
};

const rightSide = {
  flex: 1,
  background: "#0f172a",
  padding: "15px",
  borderRadius: "12px",
  color: "#fff",
  height: "80vh",
  overflowY: "auto",
};

const formBox = {
  marginBottom: "20px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
};

const btn = {
  background: "#6366f1",
  color: "#fff",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

const board = {
  display: "flex",
  gap: "20px",
};

const column = {
  flex: 1,
  background: "#0f172a",
  padding: "15px",
  borderRadius: "12px",
};

const columnTitle = {
  color: "#fff",
  marginBottom: "10px",
};

const activityItem = {
  background: "#1e293b",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "8px",
};

export default ProjectBoard;