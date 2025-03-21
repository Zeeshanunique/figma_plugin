# Cursor IDE MCP Server

This is an MCP (Model Context Protocol) server designed to be used with the Cursor IDE. It provides a set of tools and resources that can be accessed through the Cursor chat interface.

## Current Status

This project is currently in development. We have successfully implemented basic file operations, an interactive command-line interface, and an HTTP server with REST API endpoints.

### Working Features
- Basic server setup
- Project structure
- Documentation
- Simple file operations (list, read, create, delete)
- Interactive command-line interface
- HTTP server with REST API
- Server-Sent Events (SSE) endpoint for MCP
- CommonJS compatibility

### In Progress
- MCP SDK integration
- Advanced tool implementations
- Testing

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) allows applications to provide context for LLMs in a standardized way. This server implements MCP to expose a set of tools that help with development tasks directly through the Cursor chat interface.

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd mcp-cursor-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the setup script:
   ```
   npm run setup
   ```

4. Start the server:
   ```
   npm start
   ```

## Available Scripts

- `npm start` - Start the interactive MCP server
- `npm run setup` - Run the setup script to verify your environment
- `npm run simple` - Run a simple demonstration of file operations
- `npm run http` - Start the HTTP server with REST API endpoints

## Usage with Cursor IDE

To connect to this server from Cursor IDE, you need to update your MCP configuration:

1. Locate your Cursor MCP configuration file at `~/.cursor/mcp.json` (or `C:\Users\<username>\.cursor\mcp.json` on Windows)
2. Add the following configuration:
   ```json
   {
     "mcpServers": {
       "CursorPlugin": {
         "command": "cmd",
         "args": ["/c", "node", "<absolute-path-to>/mcp-cursor-server/src/mcp-interactive.cjs"]
       }
     }
   }
   ```

## Interactive Commands

The interactive MCP server supports the following commands:

- `list [directory]` - List files in a directory (default: current directory)
- `read <filename>` - Read the contents of a file
- `create <filename> <content>` - Create a new file with content
- `delete <filename>` - Delete a file
- `help` - Show help message
- `exit` - Exit the program

## HTTP Server

The HTTP server provides a REST API for file operations and an SSE endpoint for MCP. It runs on port 3333 by default.

### REST API Endpoints

- `GET /api/list?dir=path/to/directory` - List files in the specified directory (defaults to current directory)
- `GET /api/read?path=path/to/file` - Read the content of the specified file
- `POST /api/create` - Create a new file with the specified content
  ```json
  {
    "path": "path/to/file",
    "content": "File content here"
  }
  ```
- `POST /api/delete` - Delete the specified file
  ```json
  {
    "path": "path/to/file"
  }
  ```

### SSE Endpoint

- `GET /sse` - Server-Sent Events endpoint for MCP

## Planned Features

This MCP server will provide the following tools and resources:

### Tools

- **search-files**: Search for files by name pattern within a directory
- **read-file**: Read the contents of a file, with optional line range selection
- **run-command**: Execute a shell command and return the output
- **project-info**: Get information about the current project (dependencies, git info, file types)
- **suggest-code**: Get code suggestions based on provided context

### Resources

- **code-search**: Semantic search across codebase
- **api-docs**: Documentation search for a specific topic

### Prompts

- **refactor-code**: Prompt template for code refactoring

## License

This project is licensed under the MIT License - see the LICENSE file for details. 