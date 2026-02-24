const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error(
      "❌ ERROR: MONGODB_URI is not defined in environment variables!",
    );
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Instead of exiting, we let the app run so we can see logs
  }
};

module.exports = connectDB;
