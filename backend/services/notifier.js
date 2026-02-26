require("dotenv").config();
const twilio = require("twilio");

/**
 * Sends an email using Nodemailer's built-in OAuth2 support.
 */
async function sendNotification(message) {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_WHATSAPP_FROM?.trim();
  const to = process.env.WHATSAPP_TO?.trim();

  if (!sid || !token || !from || !to) {
    console.error("❌ Twilio credentials missing in .env");
    console.error(
      `Status: SID=${!!sid}, Token=${!!token}, From=${!!from}, To=${!!to}`,
    );
    return false;
  }

  try {
    // Diagnostic logging (Masked for safety)
    console.log(`🔍 Twilio Auth Attempt:`);
    console.log(
      `   - SID: ${sid.substring(0, 5)}...${sid.substring(sid.length - 4)}`,
    );
    console.log(`   - Token Length: ${token.length}`);
    console.log(`   - From: ${from}`);
    console.log(`   - To: ${to}`);

    const client = twilio(sid, token);

    const response = await client.messages.create({
      from: from,
      to: to,
      body: `⏰ *Task Notification*\n\n${message}`,
    });

    console.log(`✅ WhatsApp message sent! SID: ${response.sid}`);
    return true;
  } catch (error) {
    console.error("❌ Twilio WhatsApp Error!");
    console.error(`- Error Code: ${error.code || "N/A"}`);
    console.error(`- Message: ${error.message}`);
    throw error;
  }
}
33;

module.exports = { sendNotification };
