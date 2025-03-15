#!/usr/bin/env node

/**
 * Development script for Cursor IDE MCP Server
 * Runs the TypeScript code directly using ts-node
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Cursor IDE MCP Server in development mode...');

// Determine paths based on script location
const serverPath = path.join(__dirname, 'src', 'index.ts');
const tsNodePath = path.join(__dirname, 'node_modules', '.bin', 'ts-node');

// Output some useful info
console.log(`Server path: ${serverPath}`);
console.log(`Running with ts-node: ${tsNodePath}`);
console.log('');
console.log('To connect from Cursor, use:');
console.log(`/mcp connect npx ts-node --esm ${path.resolve(__dirname)}/src/index.ts`);
console.log('');

// Run the server with ts-node
const server = spawn(tsNodePath, ['--esm', serverPath], {
  stdio: 'inherit',
  shell: process.platform === 'win32' // Use shell on Windows
});

// Handle server process events
server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.kill('SIGTERM');
}); 