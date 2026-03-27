const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// ROUTES
const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 DEBUG LOGGER
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// 🔥 ROUTES
app.use("/api/issues", issueRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity", activityRoutes);

// 🔥 TEST ROUTE
app.get("/api/test", (req, res) => {
  res.send("API working ✅");
});

// 🔥 SOCKET SERVER SETUP
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all for now (fix later)
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔥 PORT
const PORT = process.env.PORT || 5000;

// 🔥 CONNECT DB + START SERVER (IMPORTANT FIX)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
  });