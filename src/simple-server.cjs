/**
 * Simple MCP server example using CommonJS
 */

const sdk = require('@modelcontextprotocol/sdk');

console.log("MCP Server Test (CommonJS)");
console.log("==========================");
console.log("Node.js version:", process.version);
console.log("Platform:", process.platform);
console.log("MCP SDK version:", sdk.version || "Unknown");

console.log("Test completed"); 