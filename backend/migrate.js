require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const connectDB = require("./db");

const TASKS_FILE = path.join(__dirname, "tasks.json");

const migrate = async () => {
  try {
    await connectDB();

    if (!fs.existsSync(TASKS_FILE)) {
      console.log("ℹ️ No tasks.json found to migrate.");
      process.exit(0);
    }

    const rawData = fs.readFileSync(TASKS_FILE, "utf8");
    const tasks = JSON.parse(rawData);

    if (!Array.isArray(tasks) || tasks.length === 0) {
      console.log("ℹ️ No tasks in tasks.json to migrate.");
      process.exit(0);
    }

    console.log(`🚀 Migrating ${tasks.length} tasks...`);

    for (const task of tasks) {
      const { name, schedule, message } = task;

      // Check if task already exists by name and schedule (simple check)
      const existing = await Task.findOne({ name, schedule });

      if (!existing) {
        await Task.create({ name, schedule, message });
        console.log(`✅ Migrated: ${name}`);
      } else {
        console.log(`⏭️ Skipped (already exists): ${name}`);
      }
    }

    console.log("🎉 Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();
