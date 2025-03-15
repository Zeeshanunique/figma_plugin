# Cursor IDE MCP Server

This is an MCP (Model Context Protocol) server designed to be used with the Cursor IDE. It provides a set of tools and resources that can be accessed through the Cursor chat interface.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) allows applications to provide context for LLMs in a standardized way. This server implements MCP to expose a set of tools that help with development tasks directly through the Cursor chat interface.

## Features

This MCP server provides the following tools and resources:

### Tools

- **search-files**: Search for files by name pattern within a directory
- **read-file**: Read the contents of a file, with optional line range selection
- **run-command**: Execute a shell command and return the output
- **project-info**: Get information about the current project (dependencies, git info, file types)
- **suggest-code**: Get code suggestions based on provided context (placeholder in this demo)

### Resources

- **code-search**: Semantic search across codebase (placeholder in this demo)
- **api-docs**: Documentation search for a specific topic (placeholder in this demo)

### Prompts

- **refactor-code**: Prompt template for code refactoring

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

3. Build the server:
   ```
   npm run build
   ```

## Usage with Cursor IDE

To use this MCP server with Cursor IDE:

1. Start the server:
   ```
   npm start
   ```

2. In Cursor, connect to the MCP server with the following command in the AI chat:
   ```
   /mcp connect <path-to-server>/mcp-cursor-server
   ```

   Alternatively, if you want to run in development mode:
   ```
   npm run dev
   ```
   And then connect using:
   ```
   /mcp connect npx ts-node --esm <path-to-server>/mcp-cursor-server/src/index.ts
   ```

3. Once connected, you can use the MCP commands directly from the Cursor chat:

   Example usages:
   ```
   /mcp search-files "*.ts"
   /mcp read-file src/index.ts
   /mcp project-info
   /mcp run-command "npm list --depth=0"
   ```

## Extending the Server

You can extend this server with additional tools by modifying the `src/index.ts` file:

```typescript
// Add a new tool
server.tool(
  "your-tool-name",
  {
    // Define parameters with zod schemas
    param1: z.string().describe("Description of parameter 1"),
    param2: z.number().optional().describe("Description of parameter 2")
  },
  async ({ param1, param2 }) => {
    // Implement your tool logic here
    return {
      content: [{ type: "text", text: "Your tool result" }]
    };
  }
);
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 