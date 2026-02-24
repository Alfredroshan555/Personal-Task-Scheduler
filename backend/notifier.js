/**
 * notifier.js
 * Handles the logic for sending notifications via Email using Nodemailer.
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

// Destructure credentials from environment variables
const {
  EMAIL_SERVICE,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  EMAIL_TO,
} = process.env;

/**
 * Creates a reusable transporter object using the default SMTP transport.
 */
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE, // e.g., 'gmail'
  host: EMAIL_HOST, // e.g., 'smtp.example.com'
  port: EMAIL_PORT, // e.g., 587
  secure: EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Sends an email notification to the configured recipient.
 *
 * @param {string} message - The text content of the notification.
 * @returns {Promise<void>}
 */
async function sendNotification(message) {
  // Check if critical credentials are set
  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
    console.error(
      "❌ Error: Missing email configuration in .env file (EMAIL_USER, EMAIL_PASS, EMAIL_TO).",
    );
    return;
  }

  const mailOptions = {
    from: EMAIL_FROM || EMAIL_USER, // Sender address
    to: EMAIL_TO, // List of receivers
    subject: "Task Scheduler Notification", // Subject line
    text: message, // Plain text body
    // html: `<p>${message}</p>`, // HTML body (optional)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}

module.exports = { sendNotification };
