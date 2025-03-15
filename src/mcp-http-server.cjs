console.log("MCP HTTP Server Starting..."); 
console.log("Node.js version:", process.version); 
console.log("Platform:", process.platform);

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3333;

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log(`Received request: ${req.method} ${pathname}`);
  
  // Set CORS headers to allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // API endpoints
  if (pathname === "/api/list") {
    // List files in directory
    const directory = parsedUrl.query.dir || ".";
    try {
      const files = fs.readdirSync(directory);
      const fileDetails = files.map(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          modified: stats.mtime
        };
      });
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, files: fileDetails }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } else if (pathname === "/api/read") {
    // Read file content
    const filePath = parsedUrl.query.path;
    
    if (!filePath) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "File path is required" }));
      return;
    }
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, content }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "File not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } else if (pathname === "/api/create" && req.method === "POST") {
    // Create file - requires POST with JSON body
    let body = "";
    
    req.on("data", chunk => {
      body += chunk.toString();
    });
    
    req.on("end", () => {
      try {
        const { path: filePath, content } = JSON.parse(body);
        
        if (!filePath) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "File path is required" }));
          return;
        }
        
        fs.writeFileSync(filePath, content || "");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: `File ${filePath} created successfully` }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else if (pathname === "/api/delete" && req.method === "POST") {
    // Delete file - requires POST with JSON body
    let body = "";
    
    req.on("data", chunk => {
      body += chunk.toString();
    });
    
    req.on("end", () => {
      try {
        const { path: filePath } = JSON.parse(body);
        
        if (!filePath) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "File path is required" }));
          return;
        }
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, message: `File ${filePath} deleted successfully` }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "File not found" }));
        }
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else if (pathname === "/sse") {
    // Server-Sent Events endpoint for MCP
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    
    res.write("event: connected\ndata: Connected to MCP Server\n\n");
    
    // Keep connection alive
    const intervalId = setInterval(() => {
      res.write(`event: ping\ndata: ${new Date().toISOString()}\n\n`);
    }, 30000); // Send ping every 30 seconds
    
    // Handle client disconnect
    req.on("close", () => {
      clearInterval(intervalId);
      console.log("Client disconnected from SSE");
    });
  } else {
    // Serve static HTML for the root path
    if (pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<!DOCTYPE html>
<html>
<head>
  <title>MCP Server</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .endpoint { background: #f5f5f5; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
    pre { background: #eee; padding: 10px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>MCP Server</h1>
  <p>Running on port ${PORT}</p>
  
  <h2>Available Endpoints:</h2>
  
  <div class="endpoint">
    <h3>List Files</h3>
    <p><code>GET /api/list?dir=path/to/directory</code></p>
    <p>Lists files in the specified directory (defaults to current directory)</p>
  </div>
  
  <div class="endpoint">
    <h3>Read File</h3>
    <p><code>GET /api/read?path=path/to/file</code></p>
    <p>Reads the content of the specified file</p>
  </div>
  
  <div class="endpoint">
    <h3>Create File</h3>
    <p><code>POST /api/create</code></p>
    <p>Creates a new file with the specified content</p>
    <pre>
{
  "path": "path/to/file",
  "content": "File content here"
}
    </pre>
  </div>
  
  <div class="endpoint">
    <h3>Delete File</h3>
    <p><code>POST /api/delete</code></p>
    <p>Deletes the specified file</p>
    <pre>
{
  "path": "path/to/file"
}
    </pre>
  </div>
  
  <div class="endpoint">
    <h3>SSE Endpoint</h3>
    <p><code>GET /sse</code></p>
    <p>Server-Sent Events endpoint for MCP</p>
  </div>
</body>
</html>`);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`MCP HTTP Server running at http://localhost:${PORT}/`);
  console.log("Available endpoints:");
  console.log("- GET /api/list?dir=path/to/directory");
  console.log("- GET /api/read?path=path/to/file");
  console.log("- POST /api/create");
  console.log("- POST /api/delete");
  console.log("- GET /sse (Server-Sent Events for MCP)");
}); 