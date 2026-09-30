const path = require('path');

// Ensure modules in server/node_modules can be resolved in both local and serverless environments
const serverNodeModules = path.join(__dirname, '../server/node_modules');
if (!module.paths.includes(serverNodeModules)) {
  module.paths.push(serverNodeModules);
}

const dotenv = require('dotenv');
// In local development, load server/.env if present
dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config();

const app = require('../server/app');

module.exports = app;
