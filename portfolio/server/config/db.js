const mongoose = require("mongoose");
const setupJsonDbFallback = require("./jsonDbFallback");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/jainish_portfolio";
    // Set connection timeout to 3 seconds for local checks
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`🔴 MongoDB Connection Error: ${error.message}`);
    setupJsonDbFallback();
  }
};

module.exports = connectDB;
