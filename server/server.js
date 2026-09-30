const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start local server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error(`❌ MongoDB initial connection failed: ${err.message}`);
    // Start server anyway so developer can access error messages and health check
    app.listen(PORT, () => {
      console.log(`⚠️ Server running with DB offline on http://localhost:${PORT}`);
    });
  });
