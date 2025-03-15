/**
 * Setup script for MCP Cursor Server
 * 
 * This script helps users get started with the MCP Cursor Server
 */

console.log("MCP Cursor Server Setup");
console.log("======================");
console.log("Node.js version:", process.version);
console.log("Platform:", process.platform);

// Check if dependencies are installed
try {
  require('fs');
  console.log("✓ Node.js core modules available");
} catch (error) {
  console.error("✗ Node.js core modules not available:", error.message);
}

// Check if MCP SDK is installed
try {
  const packageJson = require('./package.json');
  console.log("✓ Package.json found");
  console.log("  - Name:", packageJson.name);
  console.log("  - Version:", packageJson.version);
  console.log("  - Description:", packageJson.description);
} catch (error) {
  console.error("✗ Package.json not found:", error.message);
}

// Check if src directory exists
const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join(__dirname, 'src'))) {
  console.log("✓ src directory found");
  
  // List files in src directory
  const files = fs.readdirSync(path.join(__dirname, 'src'));
  console.log("  - Files:", files.join(', '));
} else {
  console.error("✗ src directory not found");
}

console.log("\nSetup complete!");
console.log("To start the server, run: npm start");
console.log("For more information, see the README.md file"); 