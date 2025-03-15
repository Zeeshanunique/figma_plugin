# Cursor IDE MCP Server

This is an MCP (Model Context Protocol) server designed to be used with the Cursor IDE. It provides a set of tools and resources that can be accessed through the Cursor chat interface.

## Current Status

This project is currently in development. The basic structure is in place, but there are some compatibility issues with the MCP SDK that need to be resolved.

### Working Features
- Basic server setup
- Project structure
- Documentation

### In Progress
- MCP SDK integration
- Tool implementations
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

3. Start the server:
   ```
   npm start
   ```

## Usage with Cursor IDE

Once the MCP SDK integration is complete, you'll be able to connect to this server from Cursor IDE:

```
/mcp connect <path-to-server>/mcp-cursor-server
```

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