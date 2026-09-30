const mongoose = require('mongoose');

// Cache database connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If connection is already open (readyState === 1), reuse existing connection immediately
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  // If connection is in progress, await the existing promise
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (err) {
      cached.promise = null;
      throw err;
    }
  }

  const rawUri = process.env.MONGO_URI;
  if (!rawUri) {
    throw new Error(
      'MONGO_URI environment variable is missing. Please configure MONGO_URI in your Vercel Project Settings (Environment Variables).'
    );
  }

  // Clean URI: trim leading/trailing whitespace and quotes that can be accidentally added in Vercel UI
  const uri = rawUri.trim().replace(/^["']|["']$/g, '');

  // Serverless-optimized connection options
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 15000, // 15s to allow for serverless cold start DNS resolution
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    autoIndex: process.env.NODE_ENV !== 'production',
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
      const sanitized = err.message ? err.message.replace(/:([^:@]+)@/, ':****@') : 'MongoDB connection failed';
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
