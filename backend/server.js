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
app.use(cors()); // allow all for now
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

// 🔥 CREATE SERVER
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP (FIXED)
const io = new Server(server, {
  cors: {
    origin: "*", // 🔥 FIX: allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 🔥 MAKE SOCKET GLOBAL
global.io = io;

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 🔥 PORT
const PORT = process.env.PORT || 5000;

// 🔥 DEBUG ENV
console.log("MONGO_URI:", process.env.MONGO_URI);

// 🔥 CONNECT DATABASE FIRST, THEN START SERVER
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