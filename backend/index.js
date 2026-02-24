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

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

// Start the Server and Scheduler
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await startScheduler();
});
