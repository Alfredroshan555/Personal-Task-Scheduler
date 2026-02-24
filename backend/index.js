/**
 * index.js
 * Main entry point for the task scheduler application.
 * Initializes the server and scheduler.
 */

require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const { startScheduler } = require("./services/schedulerService");
const taskRoutes = require("./routes/taskRoutes");

const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

// Keep-Alive Logic for Render Free Tier
function keepAlive(url) {
  if (!url) {
    console.log("⚠️ RENDER_EXTERNAL_URL not set. Keep-alive disabled.");
    return;
  }
  console.log(`🚀 Keep-alive initialized for: ${url}`);
  setInterval(() => {
    https
      .get(url, (res) => {
        console.log(`📡 Self-ping successful: ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error(`❌ Self-ping failed: ${err.message}`);
      });
  }, 600000); // Ping every 10 minutes (600,000 ms)
}

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ status: "healthy", message: "Task Scheduler API is running" });
});
app.use("/tasks", taskRoutes);

// Start the Server and Scheduler
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await startScheduler();

  // Initialize keep-alive if URL is provided
  const externalUrl = process.env.RENDER_EXTERNAL_URL;
  keepAlive(externalUrl);
});
