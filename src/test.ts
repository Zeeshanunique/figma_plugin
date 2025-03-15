/**
 * Simple test file to verify our setup
 */

console.log("MCP Server Test");
console.log("===============");
console.log("Node.js version:", process.version);
console.log("Platform:", process.platform);

// Try to import the MCP SDK
try {
  const sdk = require('@modelcontextprotocol/sdk');
  console.log("MCP SDK version:", sdk.version || "Unknown");
  console.log("MCP SDK loaded successfully");
} catch (error) {
  console.error("Failed to load MCP SDK:", error);
}

// Try to import zod
try {
  const zod = require('zod');
  console.log("Zod loaded successfully");
} catch (error) {
  console.error("Failed to load Zod:", error);
}

console.log("Test completed"); 