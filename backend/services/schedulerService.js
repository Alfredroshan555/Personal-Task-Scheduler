const cron = require("node-cron");
const Task = require("../models/Task");
const { sendNotification } = require("./notifier");

// Store running cron jobs in memory to manage them
let runningJobs = [];

/**
 * Starts (or restarts) the scheduler by loading tasks from DB and setting up cron jobs or timeouts.
 */
async function startScheduler() {
  console.log("🔄 Refreshing Scheduler...");

  // Stop all currently running jobs
  runningJobs.forEach((job) => (job.stop ? job.stop() : clearTimeout(job)));
  runningJobs = [];

  try {
    const tasks = await Task.find({ status: "pending" });

    if (tasks.length === 0) {
      console.log("⚠️ No pending tasks found in database.");
      return;
    }

    tasks.forEach((task) => {
      console.log(`📝 Processing task: "${task.name}" (Type: ${task.type})`);
      if (task.type === "recurring") {
        // Validate the cron expression before scheduling
        if (!cron.validate(task.schedule)) {
          console.error(
            `❌ Invalid cron schedule for task "${task.name}": ${task.schedule}`,
          );
          return;
        }

        const job = cron.schedule(task.schedule, async () => {
          console.log(
            `⏰ [${new Date().toISOString()}] Triggering recurring task: "${task.name}"`,
          );
          try {
            await sendNotification(task.message);
            console.log(
              `📲 Notification for "${task.name}" sent successfully.`,
            );
          } catch (err) {
            // Error is already logged by sendNotification, we just need to catch it here
            // to prevent the "sent successfully" message from showing up.
          }
        });
        runningJobs.push(job);
        console.log(
          `✅ Scheduled Recurring: "${task.name}" -> [${task.schedule}]`,
        );
      } else if (task.type === "onetime") {
        const now = new Date();
        const delay = new Date(task.scheduledAt).getTime() - now.getTime();

        if (delay <= 0) {
          console.log(
            `⚠️ One-time task "${task.name}" is in the past. Triggering now or skipping...`,
          );
          if (Math.abs(delay) < 3600000) {
            triggerOneTimeTask(task);
          } else {
            console.log(`⏭️ Skipping old one-time task: "${task.name}"`);
            task.status = "completed";
            task.save();
          }
          return;
        }

        const timeout = setTimeout(async () => {
          await triggerOneTimeTask(task);
        }, delay);

        runningJobs.push(timeout);
        console.log(
          `✅ Scheduled One-time: "${task.name}" at ${task.scheduledAt}`,
        );
      }
    });

    console.log(`\nScheduler running with ${runningJobs.length} active jobs.`);
  } catch (error) {
    console.error("❌ Error starting scheduler:", error.message);
  }
}

async function triggerOneTimeTask(task) {
  console.log(
    `⏰ Triggering one-time task: "${task.name}" - ${new Date().toISOString()}`,
  );
  try {
    await sendNotification(task.message);
    task.status = "completed";
    await task.save();
    console.log(
      `📲 Notification for "${task.name}" sent successfully. Marked as completed.`,
    );
  } catch (err) {
    console.error(
      `❌ Error sending notification for "${task.name}":`,
      err.message,
    );
  }
}

module.exports = {
  startScheduler,
};
