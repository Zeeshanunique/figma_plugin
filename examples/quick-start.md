# Cursor IDE MCP Server - Quick Start Guide

This guide will help you get started with using the Cursor IDE MCP Server to enhance your development workflow.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Cursor IDE](https://cursor.sh/)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd mcp-cursor-server
   npm install
   ```

2. Start the server in development mode:

   ```bash
   npm run dev
   ```

   You should see output like:
   ```
   Starting Cursor IDE MCP Server in development mode...
   Server path: /path/to/mcp-cursor-server/src/index.ts
   Running with ts-node: /path/to/mcp-cursor-server/node_modules/.bin/ts-node

   To connect from Cursor, use:
   /mcp connect npx ts-node --esm /path/to/mcp-cursor-server/src/index.ts
   ```

## Connecting from Cursor IDE

1. Open Cursor IDE and any project
2. Open the AI chat panel (usually with `Ctrl+Shift+L` or click on "AI" in the sidebar)
3. Connect to your running MCP server by typing the command shown in the server output:

   ```
   /mcp connect npx ts-node --esm /path/to/mcp-cursor-server/src/index.ts
   ```

   Replace `/path/to/mcp-cursor-server` with your actual path.

4. You should see a confirmation message that the connection was successful.

## Using MCP Tools

Once connected, you can use the available tools in the Cursor chat:

### Searching for Files

```
/mcp search-files "*.ts"
```

### Reading File Contents

```
/mcp read-file src/index.ts
```

Or with line selection:

```
/mcp read-file path="src/index.ts" lines="10-20"
```

### Running Commands

```
/mcp run-command "npm list --depth=0"
```

### Getting Project Information

```
/mcp project-info
```

### Refactoring Code

```
/mcp refactor-code codeToRefactor="function example() { return 'hello world'; }" language="javascript"
```

## Troubleshooting

If you encounter issues:

1. **Connection Problems**: Ensure the server is running and the path is correct in your connect command.

2. **Command Not Found**: Make sure you're using the exact tool name as defined in the server.

3. **Server Crashes**: Check the server console for error messages. Most errors will be shown there.

## Next Steps

- Check out the examples directory for more usage examples
- Modify the `src/index.ts` file to add your own custom tools
- Use the `edit-file` tool to make changes to files directly from Cursor chat 