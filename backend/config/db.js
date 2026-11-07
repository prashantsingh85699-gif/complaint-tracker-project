const mongoose = require('mongoose');
const dns = require('dns');

// On Windows local development, some ISPs/routers reject SRV DNS queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Continue with default DNS if custom server setting fails
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.error('Check: 1) Is MONGO_URI set correctly? 2) In MongoDB Atlas -> Network Access, is IP set to 0.0.0.0/0?');
  }
};

module.exports = connectDB;
