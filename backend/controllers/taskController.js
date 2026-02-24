const Task = require("../models/Task");
const { startScheduler } = require("../services/schedulerService");
const cron = require("node-cron");

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new task
const addTask = async (req, res) => {
  const { name, type, schedule, scheduledAt, message } = req.body;

  if (!name || !message || !type) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, message, type" });
  }

  if (type === "recurring" && (!schedule || !cron.validate(schedule))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing cron schedule for recurring task" });
  }

  if (type === "onetime" && (!scheduledAt || isNaN(Date.parse(scheduledAt)))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing scheduledAt for one-time task" });
  }

  try {
    const newTask = new Task({
      name,
      type,
      schedule,
      scheduledAt,
      message,
    });

    await newTask.save();

    // Restart scheduler to pick up changes
    await startScheduler();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await startScheduler();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Debug endpoint to check DB status
const debugDB = async (req, res) => {
  try {
    const taskCount = await Task.countDocuments();
    const connectionState = require("mongoose").connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    res.json({
      status: states[connectionState],
      taskCount,
      dbName: require("mongoose").connection.name,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getTasks,
  addTask,
  deleteTask,
  debugDB,
};
