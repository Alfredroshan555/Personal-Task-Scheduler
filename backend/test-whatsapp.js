require("dotenv").config();
const { sendNotification } = require("./services/notifier");

async function test() {
  console.log("🚀 Testing WhatsApp notification...");
  try {
    const success = await sendNotification(
      "This is a test notification from your Task Scheduler! 🚀",
    );
    if (success) {
      console.log("🎉 Test message sent successfully!");
    } else {
      console.log("⚠️ Test failed (check your .env credentials).");
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

test();
