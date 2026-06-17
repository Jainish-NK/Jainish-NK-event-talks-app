require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configurations - Allows all origins for local testing, can be locked down in production
app.use(cors());
app.use(express.json());

// Main entry log
console.log("⚙️ Initializing Portfolio Backend Server...");

// Import Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const experienceRoutes = require("./routes/experiences");
const messageRoutes = require("./routes/messages");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/messages", messageRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// Startup Routine
const startServer = async () => {
  try {
    // Connect to database (with JSON fallback logic)
    await db.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🔴 Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
