require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL   // Deployed production client
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        return callback(null, true);
      } else {
        return callback(new Error("Blocked by CORS policy. Origin not whitelisted."), false);
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Local Static Uploads (Multer fallback files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API Routers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/experiences", require("./routes/experiences"));
app.use("/api/certifications", require("./routes/certifications"));
app.use("/api/education", require("./routes/education"));
app.use("/api/messages", require("./routes/messages"));

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔴 Express Server Error:", err.stack || err.message);
  res.status(500).json({
    message: err.message || "An unexpected server-side error occurred.",
  });
});

// Start Server Listening
app.listen(PORT, () => {
  console.log(`🚀 Production MERN Backend running on http://localhost:${PORT}`);
});
