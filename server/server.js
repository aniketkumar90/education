const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start local server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use by another application. Please stop the process using port ${PORT}.`);
      } else {
        console.error(`❌ Server error: ${err.message}`);
      }
    });
  })
  .catch((err) => {
    console.error(`❌ MongoDB initial connection failed: ${err.message}`);
    // Start server anyway so developer can access error messages and health check
    const server = app.listen(PORT, () => {
      console.log(`⚠️ Server running with DB offline on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use by another application. Please stop the process using port ${PORT}.`);
      } else {
        console.error(`❌ Server error: ${err.message}`);
      }
    });
  });
