const mongoose = require('mongoose');

// Cache database connection for serverless / reused invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If connection is already open (readyState === 1), return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is currently in progress (readyState === 2), await existing promise
  if (mongoose.connection.readyState === 2 && cached.promise) {
    return await cached.promise;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      'MONGO_URI environment variable is missing. Please configure MONGO_URI in your Vercel Project Settings (Environment Variables).'
    );
  }

  // Serverless-optimized connection options
  const opts = {
    serverSelectionTimeoutMS: 10000, // Timeout after 10s if Atlas is unreachable
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  };

  cached.promise = mongoose
    .connect(uri, opts)
    .then((m) => {
      // Log only the sanitized cluster host (never credentials)
      console.log(`✅ MongoDB Connected: ${m.connection.host}`);
      cached.conn = m.connection;
      return m.connection;
    })
    .catch((err) => {
      cached.promise = null;
      cached.conn = null;
      // Sanitize any password in error messages
      const sanitized = err.message.replace(/:([^:@]+)@/, ':****@');
      console.error(`❌ MongoDB Connection Error: ${sanitized}`);
      throw new Error(sanitized);
    });

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
};

module.exports = connectDB;
