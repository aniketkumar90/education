const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Validate environment variables safely without printing secret values
validateEnv();

const app = express();

// Standard parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration supporting local development, Vercel production domains, and preview URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(normalized) ||
        origin.endsWith('.vercel.app') ||
        (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))
      ) {
        return callback(null, true);
      }

      callback(new Error(`CORS error: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Serve local uploads folder if available
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. Health check endpoint (always accessible, handles both /api/health and /health)
app.get(['/api/health', '/health'], async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;
  let host = null;
  const hasMongoUri = Boolean(process.env.MONGO_URI);

  try {
    if (hasMongoUri) {
      const conn = await connectDB();
      dbStatus = 'connected';
      host = conn.host;
    } else {
      dbStatus = 'missing_env';
      dbError = 'MONGO_URI is not set in environment variables.';
    }
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message ? err.message.replace(/:([^:@]+)@/, ':****@') : 'Connection failed';
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    message: isHealthy ? 'DLEducationConnect API is running 🚀' : 'API is running but database is not connected',
    database: {
      status: dbStatus,
      hasMongoUri,
      host,
      error: dbError,
    },
    config: {
      mongoUriConfigured: hasMongoUri,
      jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
      clientUrlConfigured: Boolean(process.env.CLIENT_URL),
      cloudinaryConfigured: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
      ),
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 2. Database connection assurance middleware for data routes
const ensureDbConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    const safeError = err.message ? err.message.replace(/:([^:@]+)@/, ':****@') : 'Unknown DB error';
    console.error('Database connection failed on request:', safeError);
    res.status(500).json({
      message: 'Database connection failed. Please ensure MongoDB Atlas is connected and IP is whitelisted.',
      details: safeError,
    });
  }
};

// 3. Mount routes (supporting both with and without /api prefix for Vercel routing flexibility)
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/api/auth', ensureDbConnected, userRoutes);
app.use('/auth', ensureDbConnected, userRoutes);

app.use('/api/blogs', ensureDbConnected, blogRoutes);
app.use('/blogs', ensureDbConnected, blogRoutes);

// 4. 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
