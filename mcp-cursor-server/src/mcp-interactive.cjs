console.log("MCP Interactive Demo Starting..."); console.log("Node.js version:", process.version); console.log("Platform:", process.platform); const fs = require("fs"); const path = require("path"); // Available commands function listFiles(dir = ".") { console.log(`\nListing files in ${dir}:`); try { const files = fs.readdirSync(dir); files.forEach(file => { const stats = fs.statSync(path.join(dir, file)); console.log(`- ${file} ${stats.isDirectory() ? "(dir)" : `(${stats.size} bytes)`}`); }); } catch (err) { console.error(`Error listing directory: ${err.message}`); } } function readFile(filename) { if (!filename) { console.error("Filename required"); return; } try { const content = fs.readFileSync(filename, "utf8"); console.log(`\nContent of ${filename}:\n${content}`); } catch (err) { console.error(`Error reading file: ${err.message}`); } } function createFile(filename, content = "") { if (!filename) { console.error("Filename required"); return; } try { fs.writeFileSync(filename, content); console.log(`File ${filename} created successfully`); } catch (err) { console.error(`Error creating file: ${err.message}`); } } function deleteFile(filename) { if (!filename) { console.error("Filename required"); return; } try { fs.unlinkSync(filename); console.log(`File ${filename} deleted successfully`); } catch (err) { console.error(`Error deleting file: ${err.message}`); } } function showHelp() { console.log("\nAvailable operations:"); console.log("1. List files in current directory"); console.log("2. Read a file"); console.log("3. Create a file"); console.log("4. Delete a file"); } // Demo script console.log("\nMCP Interactive Demo"); showHelp(); console.log("\nExecuting file operations:"); listFiles(); createFile("test-mcp-file.txt", "This is a test file created by MCP"); readFile("test-mcp-file.txt"); listFiles(); deleteFile("test-mcp-file.txt"); listFiles(); console.log("\nMCP Interactive Demo completed");
