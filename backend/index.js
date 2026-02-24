/**
 * index.js
 * Main entry point for the task scheduler application.
 * Reads tasks from tasks.json file and schedules them using node-cron.
 * Provides an API (Express) to manage tasks dynamically.
 */

require("dotenv").config(); // Load environment variables
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const express = require("express");
const cors = require("cors");
const { sendNotification } = require("./notifier");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define the path to the tasks configuration file
const TASKS_FILE = path.join(__dirname, "tasks.json");

// Store running cron jobs in memory to manage them
let runningJobs = [];

/**
 * Loads tasks from the JSON file.
 * @returns {Array} List of task objects or an empty array if failed.
 */
function loadTasks() {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      console.log("ℹ️ tasks.json not found, creating a new one.");
      saveTasks([]);
      return [];
    }
    const rawData = fs.readFileSync(TASKS_FILE, "utf8");
    const tasks = JSON.parse(rawData);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("❌ Error reading tasks.json:", error.message);
    return [];
  }
}

/**
 * Saves tasks to the JSON file.
 * @param {Array} tasks - List of task objects to save.
 */
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    console.log("💾 Tasks saved to file.");
  } catch (error) {
    console.error("❌ Error writing tasks.json:", error.message);
  }
}

/**
 * Starts (or restarts) the scheduler by loading tasks and setting up cron jobs.
 */
function startScheduler() {
  console.log("🔄 Refreshing Scheduler...");

  // Stop all currently running jobs
  runningJobs.forEach((job) => job.stop());
  runningJobs = [];
  // console.log("⏹️ Stopped previous jobs.");

  const tasks = loadTasks();

  if (tasks.length === 0) {
    console.log("⚠️ No tasks found. Add tasks via API.");
    return;
  }

  tasks.forEach((task) => {
    // Validate the cron expression before scheduling
    if (!cron.validate(task.schedule)) {
      console.error(
        `❌ Invalid cron schedule for task "${task.name}": ${task.schedule}`,
      );
      return; // Skip invalid tasks
    }

    // Schedule the task using node-cron
    const job = cron.schedule(task.schedule, async () => {
      console.log(
        `⏰ Triggering task: "${task.name}" - ${new Date().toISOString()}`,
      );

      try {
        await sendNotification(task.message);
        console.log(`📲 Notification for "${task.name}" sent successfully.`);
      } catch (err) {
        console.error(
          `❌ Error sending notification for "${task.name}":`,
          err.message,
        );
      }
    });

    // Store the job reference
    runningJobs.push(job);

    console.log(`✅ Scheduled: "${task.name}" (${task.schedule})`);
  });

  console.log(`\nScheduler running with ${runningJobs.length} active jobs.`);
}

// --- API Endpoints ---

// Get all tasks
app.get("/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { name, schedule, message } = req.body;

  if (!name || !schedule || !message) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, schedule, message" });
  }

  if (!cron.validate(schedule)) {
    return res.status(400).json({ error: "Invalid cron schedule expression" });
  }

  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(), // Simple ID generation
    name,
    schedule,
    message,
  };

  tasks.push(newTask);
  saveTasks(tasks);

  // Restart scheduler to pick up changes
  startScheduler();

  res.status(201).json(newTask);
});

// Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  let tasks = loadTasks();

  const initialLength = tasks.length;
  // Filter out the task with the given ID
  const newTasks = tasks.filter((task) => String(task.id) !== String(id));

  if (newTasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  saveTasks(newTasks);
  startScheduler();

  res.json({ message: "Task deleted successfully" });
});

// Debug endpoint to check file system status
app.get("/api/debug-tasks", (req, res) => {
  try {
    const fileExists = fs.existsSync(TASKS_FILE);
    let content = null;
    let error = null;
    let parsed = null;

    if (fileExists) {
      content = fs.readFileSync(TASKS_FILE, "utf8");
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        error = "JSON Parse Error: " + e.message;
      }
    }
    res.json({
      path: TASKS_FILE,
      cwd: process.cwd(),
      exists: fileExists,
      contentPreview: content ? content.substring(0, 100) + "..." : null,
      error: error,
      parsedLength: parsed
        ? Array.isArray(parsed)
          ? parsed.length
          : "not array"
        : 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start the Server and Scheduler
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  startScheduler();
});
